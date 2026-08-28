using Microsoft.Playwright;

namespace GwuxDesign.PRAT.Acceptance.Pages;

public class ProfilePage : BasePage
{
    public ProfilePage(IPage page) : base(page) { }

    public ILocator AboutHeading => _page.Locator(".profile-about h1");
    public ILocator SkillBars => _page.Locator(".skill-bar");
    public ILocator LinkedInLink => _page.Locator(".profile-link");
    public ILocator SoftwareTags => _page.Locator("#software-groups .software-tag");
}