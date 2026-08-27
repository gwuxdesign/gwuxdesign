namespace TestRunner.Web.Models;

public record GitHubDispatchRequest(
    string Environment,
    string Browser,
    string Device,
    string Filter,
    bool RecordVideo,
    bool RecordTraces,
    string RunnerName
);

public record GitHubRunStatus(long RunId, string HtmlUrl, string Status, string? Conclusion);
