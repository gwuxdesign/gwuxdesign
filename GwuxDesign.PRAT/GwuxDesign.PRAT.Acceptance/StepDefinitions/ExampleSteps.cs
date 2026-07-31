using System.Threading.Tasks;
using Reqnroll;
using static Microsoft.Playwright.Assertions;
using GwuxDesign.PRAT.Acceptance.Support;

namespace GwuxDesign.PRAT.Acceptance.StepDefinitions
{
    [Binding]
    public class ExampleSteps
    {
        private readonly TestWorld _world;
        private readonly IReqnrollOutputHelper _outputHelper;

        public ExampleSteps(TestWorld world, IReqnrollOutputHelper outputHelper)
        {
            _world = world;
            _outputHelper = outputHelper;
        }

        [When("the user clicks the example button")]
        public async Task WhenTheUserClicksTheExampleButton()
        {
            await _world.Pages.examplePage.ClickExampleButton();
        }

        [Then("the user should see the example heading")]
        public async Task ThenTheUserShouldSeeTheExampleHeading()
        {
            await Expect(_world.Pages.examplePage._exampleHeading).ToBeVisibleAsync();
        }
    }
}