using System.Threading.Tasks;
using Reqnroll;
using static Microsoft.Playwright.Assertions;
using GwuxDesign.PRAT.Acceptance.Support;

namespace GwuxDesign.PRAT.Acceptance.StepDefinitions
{
    [Binding]
    public class HeaderSteps
    {
        private readonly TestWorld _world;

        public HeaderSteps(TestWorld world)
        {
            _world = world;
        }

        [When("the user clicks the {string} nav link")]
        public async Task WhenTheUserClicksTheNavLink(string text) => await _world.Pages.headerPage.ClickNavLink(text);

        [When("the user toggles the colour theme")]
        public async Task WhenTheUserTogglesTheColourTheme() => await _world.Pages.headerPage.ClickThemeToggle();

        [Given(@"the theme is set to ""(.*)""")]
        public async Task GivenTheThemeIsSetTo(string theme)
        {
            await _world.Page.EvaluateAsync($"localStorage.setItem('theme', '{theme}')");
            await _world.Page.ReloadAsync();
        }

        [Then(@"the theme should be ""(.*)""")]
        public async Task ThenTheThemeShouldBe(string theme)
        {
            var actual = await _world.Page.GetAttributeAsync("html", "data-theme");
            Assert.That(actual, Is.EqualTo(theme));
        }
    }
}