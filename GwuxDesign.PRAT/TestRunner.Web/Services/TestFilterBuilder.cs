namespace TestRunner.Web.Services;

public static class TestFilterBuilder
{
    // Converts a tag expression into a dotnet test filter string
    // Comma separation (OR):  "Smoke, Login"  → "TestCategory=Smoke|TestCategory=Login"
    // Single tag:             "Smoke"         → "TestCategory=Smoke"
    public static string Build(string suite)
    {
        if (suite.Contains(','))
        {
            var parts = suite.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            return string.Join("|", parts.Select(p => $"TestCategory={p}"));
        }

        return $"TestCategory={suite.Trim()}";
    }
}
