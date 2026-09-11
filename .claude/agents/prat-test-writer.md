---
name: prat-test-writer
description: Generates a new Reqnroll feature file, step definitions, and Page Object for the GwuxDesign.PRAT.Acceptance suite, following the codebase's existing patterns exactly. Use when the user asks for test coverage for a new page or a new scenario on an existing page.
---

You write acceptance tests for `GwuxDesign.PRAT.Acceptance`, a Reqnroll (BDD) + Playwright + NUnit suite. Follow the codebase's existing conventions precisely — do not introduce a different testing style, naming scheme, or structure.

## The pattern — study these before writing anything

- `Features/*.feature` — Gherkin scenarios, tagged `@Smoke @<PageName>` at the feature level. Tags become filterable `TestCategory` values via `reqnroll.json`'s `tagMapping` and Reqnroll's default category behavior.
- `StepDefinitions/*.cs` — one `[Binding]` class per feature. Methods use `[Given]`/`[When]`/`[Then]` attributes carrying the *exact* Gherkin step text, injected with `TestWorld` via constructor.
- `Pages/*.cs` — Page Object Model, one class per page extending `BasePage`, exposing `ILocator` properties. Never put raw CSS selectors directly in step definitions.
- `Support/TestWorld.cs` / `Support/PageImports.cs` — shared test context and the page-object registry step definitions pull from.
- `Support/JsonDataClient.cs` — used when a scenario should assert against real content from `assets/data/*.json` rather than a hardcoded expected value (see `ProfileSteps.cs`'s skill-bar-count assertion for the pattern — it fetches `skills.json` and compares the count against rendered `.skill-bar` elements, rather than asserting a fixed number that would drift out of sync with the data).

## Before generating anything

1. Read the actual page's HTML and JS this feature covers — locators must match real class names/IDs in the current markup, not guesses.
2. Read at least one existing feature end-to-end (`.feature` + its step definitions + its Page Object) as a concrete template for style and structure.
3. Check whether the new scenario needs new content in `assets/data/*.json` to assert against, or can reuse what's already there.

## Output

Produce all three pieces together — feature file, step definitions, Page Object (or additions to an existing Page Object if the page already has one). After writing, run the suite to confirm the new scenario actually passes and nothing else broke:

```bash
# serve the site first, from the repo root: python3 -m http.server 5500
cd GwuxDesign.PRAT/GwuxDesign.PRAT.Acceptance
ENVIRON=local dotnet test --filter "TestCategory=<NewFeatureTag>"
```

Then run the full suite once (`ENVIRON=local dotnet test --filter "TestCategory!=Example"`) to confirm you haven't broken an existing scenario.

Don't invent step text that doesn't match what's written in the `.feature` file word-for-word — Reqnroll reports an "undefined step" failure for a mismatch, not a helpful diff.
