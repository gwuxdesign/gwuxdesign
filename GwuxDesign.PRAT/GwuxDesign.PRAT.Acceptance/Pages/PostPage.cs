using Microsoft.Playwright;

namespace GwuxDesign.PRAT.Acceptance.Pages;

public class PostPage : BasePage
{
    public PostPage(IPage page) : base(page) { }

    public ILocator Title => _page.Locator("#post-content h1");
    public ILocator Body => _page.Locator("#post-content .post-body");
}