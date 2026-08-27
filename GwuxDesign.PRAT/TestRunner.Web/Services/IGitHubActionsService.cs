using TestRunner.Web.Models;

namespace TestRunner.Web.Services;

public interface IGitHubActionsService
{
    IAsyncEnumerable<string> RunTestsAsync(GitHubDispatchRequest request, CancellationToken cancellationToken);
}
