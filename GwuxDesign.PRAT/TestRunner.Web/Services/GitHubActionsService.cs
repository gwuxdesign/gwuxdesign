using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text.Json;
using TestRunner.Web.Models;

namespace TestRunner.Web.Services;

public class GitHubActionsService : IGitHubActionsService
{
    private static readonly TimeSpan RunAppearTimeout = TimeSpan.FromSeconds(60);
    private static readonly TimeSpan PollInterval = TimeSpan.FromSeconds(5);
    private static readonly TimeSpan RunCompletionTimeout = TimeSpan.FromMinutes(30);

    private readonly HttpClient _http;
    private readonly IConfiguration _configuration;
    private bool _configured;
    private string _owner = "";
    private string _repo = "";
    private string _workflowFileName = "";
    private string _ref = "main";

    public GitHubActionsService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _http = httpClientFactory.CreateClient(nameof(GitHubActionsService));
        _configuration = configuration;
    }

    // Deferred until the first run is actually requested, so a missing GitHub:Token
    // doesn't break the whole /run-tests page for people only using local runs.
    private void EnsureConfigured()
    {
        if (_configured) return;

        _owner = _configuration["GitHub:Owner"]
            ?? throw new InvalidOperationException("GitHub:Owner is not configured.");
        _repo = _configuration["GitHub:Repo"]
            ?? throw new InvalidOperationException("GitHub:Repo is not configured.");
        _workflowFileName = _configuration["GitHub:WorkflowFileName"]
            ?? throw new InvalidOperationException("GitHub:WorkflowFileName is not configured.");
        _ref = _configuration["GitHub:Ref"] ?? "main";

        var token = _configuration["GitHub:Token"]
            ?? throw new InvalidOperationException(
                "GitHub:Token is not configured. Set it via an environment variable or user-secret — never commit it.");

        _http.BaseAddress = new Uri("https://api.github.com/");
        _http.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        _http.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("TestRunner.Web", "1.0"));
        _http.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");

        _configured = true;
    }

    public async IAsyncEnumerable<string> RunTestsAsync(
        GitHubDispatchRequest request,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        string? configError = null;
        try
        {
            EnsureConfigured();
        }
        catch (InvalidOperationException ex)
        {
            configError = ex.Message;
        }

        if (configError is not null)
        {
            yield return $"[ERROR] {configError}";
            yield break;
        }

        var dispatchedAt = DateTimeOffset.UtcNow;

        yield return "Dispatching workflow run on GitHub Actions...";

        var dispatchBody = new
        {
            @ref = _ref,
            inputs = new Dictionary<string, string>
            {
                ["environment"] = request.Environment,
                ["browser"] = request.Browser,
                ["device"] = request.Device,
                ["filter"] = request.Filter,
                ["record_video"] = request.RecordVideo ? "true" : "false",
                ["record_traces"] = request.RecordTraces ? "true" : "false",
                ["runner_name"] = request.RunnerName,
            }
        };

        var dispatchResponse = await _http.PostAsJsonAsync(
            $"repos/{_owner}/{_repo}/actions/workflows/{_workflowFileName}/dispatches",
            dispatchBody,
            cancellationToken);

        if (!dispatchResponse.IsSuccessStatusCode)
        {
            var body = await dispatchResponse.Content.ReadAsStringAsync(cancellationToken);
            yield return $"[ERROR] Failed to dispatch workflow: {dispatchResponse.StatusCode} — {body}";
            yield break;
        }

        yield return "Workflow dispatched. Waiting for the run to start...";

        var run = await FindNewRunAsync(dispatchedAt, cancellationToken);
        if (run is null)
        {
            yield return "[ERROR] Timed out waiting for the run to appear on GitHub Actions. Check the Actions tab manually.";
            yield break;
        }

        yield return $"Run started: {run.HtmlUrl}";
        yield return $"REPORT-LINK:{run.HtmlUrl}";

        var deadline = DateTimeOffset.UtcNow + RunCompletionTimeout;
        var lastStatus = "";

        while (DateTimeOffset.UtcNow < deadline)
        {
            await Task.Delay(PollInterval, cancellationToken);

            run = await GetRunAsync(run!.RunId, cancellationToken);
            if (run is null) continue;

            if (run.Status != lastStatus)
            {
                yield return $"Status: {run.Status}";
                lastStatus = run.Status;
            }

            if (run.Status == "completed")
            {
                yield return $"Finished with conclusion: {run.Conclusion}";
                yield return "COMPLETE";
                yield break;
            }
        }

        yield return "[WARN] Gave up polling after 30 minutes — the run may still be in progress on GitHub.";
        yield return "COMPLETE";
    }

    private async Task<GitHubRunStatus?> FindNewRunAsync(DateTimeOffset dispatchedAt, CancellationToken cancellationToken)
    {
        var deadline = DateTimeOffset.UtcNow + RunAppearTimeout;

        while (DateTimeOffset.UtcNow < deadline)
        {
            var url = $"repos/{_owner}/{_repo}/actions/workflows/{_workflowFileName}/runs" +
                       $"?event=workflow_dispatch&per_page=5";

            using var response = await _http.GetAsync(url, cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
                using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

                foreach (var run in doc.RootElement.GetProperty("workflow_runs").EnumerateArray())
                {
                    var createdAt = run.GetProperty("created_at").GetDateTimeOffset();
                    if (createdAt >= dispatchedAt.AddSeconds(-5))
                    {
                        return ParseRun(run);
                    }
                }
            }

            await Task.Delay(TimeSpan.FromSeconds(3), cancellationToken);
        }

        return null;
    }

    private async Task<GitHubRunStatus?> GetRunAsync(long runId, CancellationToken cancellationToken)
    {
        using var response = await _http.GetAsync(
            $"repos/{_owner}/{_repo}/actions/runs/{runId}", cancellationToken);

        if (!response.IsSuccessStatusCode) return null;

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
        return ParseRun(doc.RootElement);
    }

    private static GitHubRunStatus ParseRun(JsonElement run)
    {
        return new GitHubRunStatus(
            run.GetProperty("id").GetInt64(),
            run.GetProperty("html_url").GetString()!,
            run.GetProperty("status").GetString()!,
            run.TryGetProperty("conclusion", out var conclusion) ? conclusion.GetString() : null
        );
    }
}
