using System.Threading.Tasks;
using Reqnroll;
using static Microsoft.Playwright.Assertions;
using GwuxDesign.PRAT.Acceptance.Support;

namespace GwuxDesign.PRAT.Acceptance.StepDefinitions
{
    [Binding]
    public class NavigationSteps
    {
        private readonly TestWorld _world;

        public NavigationSteps(TestWorld world)
        {
            _world = world;
        }

        [Given("the user navigates to the application")]
        public async Task GivenTheUserNavigatesToTheApplication()
        {
            await _world.Page.GotoAsync(_world.BaseUrl);
        }

        [Then("the browser should be on the {string} page")]
        public async Task ThenTheBrowserShouldBeOnThePage(string path)
        {
            await Expect(_world.Page).ToHaveURLAsync(new System.Text.RegularExpressions.Regex($"{System.Text.RegularExpressions.Regex.Escape(path)}$"));
        }

        [When("the user navigates to the {string} page")]
        public async Task WhenTheUserNavigatesToThePage(string pageName)
        {
            var path = pageName switch
            {
                "Projects" => "/pages/projects/",
                "Profile" => "/pages/profile/",
                "Contact" => "/pages/contact/",
                _ => throw new ArgumentException($"Unknown page: {pageName}")
            };
            await _world.Page.GotoAsync($"{_world.BaseUrl}{path}");
        }
    }
}