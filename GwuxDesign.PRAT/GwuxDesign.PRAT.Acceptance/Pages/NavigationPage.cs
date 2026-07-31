using Microsoft.Playwright;

namespace GwuxDesign.PRAT.Acceptance.Pages;

public class NavigationPage : BasePage
{
    public NavigationPage(IPage page) : base(page) { }

    // public ILocator NavLink(string text) => _page.Locator("nav#primary-nav a", new() { HasText = text });
    // public ILocator ThemeToggle => _page.GetByRole(AriaRole.Button, new() { Name = "Toggle colour theme" });

    // public async Task ClickNavLink(string text) => await NavLink(text).ClickAsync();
    // public async Task ClickThemeToggle() => await ThemeToggle.ClickAsync();
}