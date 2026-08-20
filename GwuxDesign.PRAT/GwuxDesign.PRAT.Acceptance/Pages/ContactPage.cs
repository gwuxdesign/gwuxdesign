using Microsoft.Playwright;

namespace GwuxDesign.PRAT.Acceptance.Pages;

public class ContactPage : BasePage
{
    public ContactPage(IPage page) : base(page) { }

    public ILocator Form => _page.Locator("#contact-form");
    public ILocator NameInput => _page.Locator("#name");
    public ILocator EmailInput => _page.Locator("#email");
    public ILocator MessageInput => _page.Locator("#message");
    public ILocator SubmitButton => _page.Locator("#contact-form button[type=\"submit\"]");
    public ILocator ErrorFor(string field) => _page.Locator($"[data-error-for=\"{field}\"]");
}