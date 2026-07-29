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

        // Example page - replace with your own page objects
        public ExamplePage examplePage => new ExamplePage(_page);

        // Example page requiring TestWorld context - replace with your own page objects
        // public ExampleWorldPage exampleWorldPage => new ExampleWorldPage(_world);
    }
}