using System;
using Microsoft.Playwright;
using GwuxDesign.PRAT.Acceptance.Pages;

namespace GwuxDesign.PRAT.Acceptance.Support
{
    public class PageImports
    {
        private readonly TestWorld _world;
        private readonly IPage _page;

        public PageImports(TestWorld world)
        {
            _world = world ?? throw new ArgumentNullException(nameof(world));
            _page = _world.Page ?? throw new ArgumentNullException(nameof(_world.Page));
        }

        public HomePage homePage => new HomePage(_page);
        public HeaderPage headerPage => new HeaderPage(_page);
        public NavigationPage navigationPage => new NavigationPage(_page);
        public ProfilePage profilePage => new ProfilePage(_page);
        public ProjectsPage projectsPage => new ProjectsPage(_page);
        public ContactPage contactPage => new ContactPage(_page);
        public PostPage postPage => new PostPage(_page);

        // Example page requiring TestWorld context - replace with your own page objects
        // public ExampleWorldPage exampleWorldPage => new ExampleWorldPage(_world);
    }
}