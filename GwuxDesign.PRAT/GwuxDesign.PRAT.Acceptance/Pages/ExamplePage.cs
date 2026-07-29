using Microsoft.Playwright;

namespace GwuxDesign.PRAT.Acceptance.Pages;

public class ExamplePage : BasePage
{
    public ExamplePage(IPage page) : base(page) { }

    // Example locators - replace with your own selectors
    // Locators are defined as properties using Playwright's Locator API
    // See https://playwright.dev/dotnet/docs/locators for guidance

    // Example: locate by ID
    public ILocator _exampleButton => _page.Locator("#example-button-id");

    // Example: locate by text
    public ILocator _exampleHeading => _page.Locator("h1:has-text('Example Heading')");

    // Example: locate by role
    public ILocator _exampleInput => _page.GetByRole(AriaRole.Textbox, new() { Name = "Example Input" });

    // Example methods - replace with your own interactions
    public async Task ClickExampleButton() => await _exampleButton.ClickAsync();

    public async Task FillExampleInput(string value) => await _exampleInput.FillAsync(value);
}
