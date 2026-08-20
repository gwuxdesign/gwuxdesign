using System.Collections.Generic;
using System.Threading.Tasks;
using Reqnroll;
using NUnit.Framework;
using GwuxDesign.PRAT.Acceptance.Support;

namespace GwuxDesign.PRAT.Acceptance.StepDefinitions
{
    [Binding]
    public class ProjectsSteps
    {
        private readonly TestWorld _world;

        public ProjectsSteps(TestWorld world)
        {
            _world = world;
        }

        [Then("at least one project card should be displayed")]
        public async Task ThenAtLeastOneProjectCardShouldBeDisplayed()
        {
            var count = await _world.Pages.projectsPage.ProjectCards.CountAsync();
            Assert.That(count, Is.GreaterThan(0));
        }

        [Then("every project card should link to the URL defined in the project data")]
        public async Task ThenEveryProjectCardShouldLinkCorrectly()
        {
            var projects = await JsonDataClient.GetAsync<List<ProjectEntry>>($"{_world.BaseUrl}/assets/data/projects.json");

            foreach (var project in projects!)
            {
                var href = await _world.Pages.projectsPage.ProjectLink(project.Title).GetAttributeAsync("href");
                Assert.That(href, Is.EqualTo(project.Link), $"Mismatch for project '{project.Title}'");
            }
        }

        private record ProjectEntry(string Id, string Title, string Description, string Link, int Year, List<string> Tags);
    }
}