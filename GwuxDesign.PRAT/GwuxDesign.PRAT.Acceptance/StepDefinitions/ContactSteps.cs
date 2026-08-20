using System.Threading.Tasks;
using Reqnroll;
using static Microsoft.Playwright.Assertions;
using GwuxDesign.PRAT.Acceptance.Support;

namespace GwuxDesign.PRAT.Acceptance.StepDefinitions
{
    [Binding]
    public class ContactSteps
    {
        private readonly TestWorld _world;

        public ContactSteps(TestWorld world)
        {
            _world = world;
        }

        [Then("the contact form should be displayed")]
        public async Task ThenTheContactFormShouldBeDisplayed()
        {
            var contactPage = _world.Pages.contactPage;
            await Expect(contactPage.Form).ToBeVisibleAsync();
            await Expect(contactPage.NameInput).ToBeVisibleAsync();
            await Expect(contactPage.EmailInput).ToBeVisibleAsync();
            await Expect(contactPage.MessageInput).ToBeVisibleAsync();
        }

        [When("the user submits the contact form with name {string} email {string} and message {string}")]
        public async Task WhenTheUserSubmitsTheContactForm(string name, string email, string message)
        {
            var contactPage = _world.Pages.contactPage;
            await contactPage.NameInput.FillAsync(name);
            await contactPage.EmailInput.FillAsync(email);
            await contactPage.MessageInput.FillAsync(message);
            await contactPage.SubmitButton.ClickAsync();
        }

        [Then("the {string} field should show the error {string}")]
        public async Task ThenTheFieldShouldShowTheError(string field, string errorMessage)
        {
            await Expect(_world.Pages.contactPage.ErrorFor(field)).ToHaveTextAsync(errorMessage);
        }
    }
}