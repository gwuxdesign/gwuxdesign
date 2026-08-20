using System.Collections.Generic;
using System.Threading.Tasks;
using Reqnroll;
using NUnit.Framework;
using static Microsoft.Playwright.Assertions;
using GwuxDesign.PRAT.Acceptance.Support;

namespace GwuxDesign.PRAT.Acceptance.StepDefinitions
{
    [Binding]
    public class ProfileSteps
    {
        private readonly TestWorld _world;

        public ProfileSteps(TestWorld world)
        {
            _world = world;
        }

        [Then("the About heading should be visible")]
        public async Task ThenTheAboutHeadingShouldBeVisible()
        {
            await Expect(_world.Pages.profilePage.AboutHeading).ToBeVisibleAsync();
            await Expect(_world.Pages.profilePage.AboutHeading).ToHaveTextAsync("About");
        }

        [Then("the number of skill bars should match the skills data")]
        public async Task ThenSkillBarsShouldMatchData()
        {
            var skills = await JsonDataClient.GetAsync<List<SkillEntry>>($"{_world.BaseUrl}/assets/data/skills.json");

            var barCount = await _world.Pages.profilePage.SkillBars.CountAsync();
            Assert.That(barCount, Is.EqualTo(skills!.Count));
        }

        [Then("the LinkedIn link should point to {string}")]
        public async Task ThenTheLinkedInLinkShouldPointTo(string expectedUrl)
        {
            var href = await _world.Pages.profilePage.LinkedInLink.GetAttributeAsync("href");
            Assert.That(href, Is.EqualTo(expectedUrl));
        }

        [Then("at least one software row should be displayed")]
        public async Task ThenAtLeastOneSoftwareRowShouldBeDisplayed()
        {
            var count = await _world.Pages.profilePage.SoftwareTableRows.CountAsync();
            Assert.That(count, Is.GreaterThan(0));
        }

        private record SkillEntry(string Skill, int Level);
    }
}