using Microsoft.Playwright;

namespace GwuxDesign.PRAT.Acceptance.Pages;

public class ProjectsPage : BasePage
{
    public ProjectsPage(IPage page) : base(page) { }

    public ILocator ProjectCards => _page.Locator(".project-card");

    public ILocator ProjectLink(string title) =>
        _page.Locator(".project-card", new() { HasText = title }).Locator("a");
}