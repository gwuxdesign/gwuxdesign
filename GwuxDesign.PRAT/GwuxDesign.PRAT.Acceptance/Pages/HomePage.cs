using Microsoft.Playwright;

namespace GwuxDesign.PRAT.Acceptance.Pages;

public class HomePage : BasePage
{
    public HomePage(IPage page) : base(page) { }

    public ILocator PostCards => _page.Locator(".post-card");

    public ILocator PostLink(string title) =>
        _page.Locator(".post-card", new() { HasText = title }).Locator("a");
}