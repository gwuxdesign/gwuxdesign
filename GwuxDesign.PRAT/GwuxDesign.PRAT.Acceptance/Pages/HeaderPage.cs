using Microsoft.Playwright;

namespace GwuxDesign.PRAT.Acceptance.Pages;

public class HeaderPage : BasePage
{
    public HeaderPage(IPage page) : base(page) { }

    public ILocator NavLink(string text) => _page.Locator("nav#primary-nav a", new() { HasText = text });
    // public ILocator ThemeToggle => _page.GetByRole(AriaRole.Button, new() { Name = "Toggle colour theme" });
    public ILocator ThemeToggle => _page.Locator("button.theme-toggle");

    public async Task ClickNavLink(string text) => await NavLink(text).ClickAsync();
    public async Task ClickThemeToggle() => await ThemeToggle.ClickAsync();
}