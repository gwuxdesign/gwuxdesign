using System.Threading.Tasks;
using Reqnroll;
using NUnit.Framework;
using static Microsoft.Playwright.Assertions;
using GwuxDesign.PRAT.Acceptance.Support;

namespace GwuxDesign.PRAT.Acceptance.StepDefinitions
{
    [Binding]
    public class BlogSteps
    {
        private readonly TestWorld _world;

        public BlogSteps(TestWorld world)
        {
            _world = world;
        }

        [Then("at least one post card should be displayed")]
        public async Task ThenAtLeastOnePostCardShouldBeDisplayed()
        {
            var count = await _world.Pages.homePage.PostCards.CountAsync();
            Assert.That(count, Is.GreaterThan(0));
        }

        [When("the user clicks the {string} post link")]
        public async Task WhenTheUserClicksThePostLink(string title)
        {
            await _world.Pages.homePage.PostLink(title).ClickAsync();
        }

        [Then("the post page should show the title {string}")]
        public async Task ThenThePostPageShouldShowTheTitle(string title)
        {
            await Expect(_world.Pages.postPage.Title).ToHaveTextAsync(title);
        }

        [Then("the post content should be rendered as HTML, not raw Markdown")]
        public async Task ThenThePostContentShouldBeRenderedAsHtml()
        {
            var html = await _world.Pages.postPage.Body.InnerHTMLAsync();
            Assert.That(html, Does.Contain("<strong>"));
            Assert.That(html, Does.Not.Contain("**"));
        }
    }
}