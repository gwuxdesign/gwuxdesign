# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

Three independent parts share this one repo:

1. **The site** (repo root) — a hand-authored static site, no build step, no `package.json`. `index.html` is the blog index/homepage. `pages/{blog,contact,profile,projects}/` are the other pages. `assets/js/*.js` (one small vanilla-JS module per page, plus `main.js` for global nav/theme and `utils.js` for shared `fetchJSON`/`fetchText`/`escapeHtml`/`formatDate` helpers) render content fetched client-side from `assets/data/*.json`. Blog post bodies live as individual Markdown files in `posts/`, referenced by `file` in `assets/data/posts.json`, fetched and rendered client-side via `marked` + `DOMPurify` (both loaded from cdnjs with SRI hashes in `pages/blog/post.html`).
2. **`GwuxDesign.ContactFunction/`** — an isolated-worker Azure Function (`.NET`, `net10.0`) backing the contact form. Verifies a Cloudflare Turnstile token server-side, then sends the message via SendGrid to the site owner. Secrets (`SENDGRID_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_TO_EMAIL`, `ALLOWED_ORIGIN`) come from environment variables / `local.settings.json` (gitignored), never hardcoded.
3. **`GwuxDesign.PRAT/`** — a Reqnroll/Playwright BDD acceptance-test solution plus a Blazor Server dashboard (`TestRunner.Web`) for running it and browsing reports. Framed in its own README as a generic reusable template ("PRAT... designed to be cloned and adapted"), but the checked-in Features/Pages/StepDefinitions are specific to this site.

All three target `net10.0` (see `GwuxDesign.PRAT/global.json` for the pinned SDK). Open `gwuxdesign.code-workspace` (not the bare folder) in VS Code so the Cucumber extension resolves step definitions against `GwuxDesign.PRAT/GwuxDesign.PRAT.Acceptance`.

## Commands

### Serve the site locally
```
python3 -m http.server 8000   # or any static file server, from the repo root
```
There's no bundler/dev server — just serve the root directory as-is.

### Build
```
dotnet build GwuxDesign.ContactFunction                                            # Azure Function
dotnet build GwuxDesign.PRAT/GwuxDesign.PRAT.Acceptance/GwuxDesign.PRAT.Acceptance.csproj  # test suite
dotnet build GwuxDesign.PRAT/TestRunner.Web/TestRunner.Web.csproj                  # dashboard
```

### Run the acceptance tests
Tests expect the site already being served (see above) and an `Environments:<name>:BaseUrl` pointing at it. Locally that's usually via `appsettings.local.json` in `GwuxDesign.PRAT/GwuxDesign.PRAT.Acceptance/` (gitignored — copy `appsettings.json`'s structure); CI overrides it via env vars instead:
```
cd GwuxDesign.PRAT/GwuxDesign.PRAT.Acceptance
ENVIRON=local dotnet test --filter "TestCategory!=Example"
```
Run a single feature/category via the Reqnroll `TestCategory` tag mapping (`@Smoke`, `@Blog`, `@Contact`, `@Navigation`, `@Profile`, `@Projects`, etc. — tags on a `.feature` file become filterable categories):
```
dotnet test --filter "TestCategory=Blog"
```
Other env vars the test run honors (set by `TestRunnerService`/the CI workflow, or exportable by hand): `BROWSER` (chromium/firefox/webkit), `HEADED` (0/1), `DEVICE_TYPE` (Desktop/Mobile/TabletVer/TabletHor/`custom:WxH`), `RECORD_VIDEO`, `RECORD_TRACES`.

First-time Playwright browser install (per machine):
```
cd GwuxDesign.PRAT/GwuxDesign.PRAT.Acceptance
pwsh bin/Debug/net10.0/playwright.ps1 install
```

### Run TestRunner.Web (the test dashboard)
```
cd GwuxDesign.PRAT/TestRunner.Web
dotnet run
```
Needs `TestRunner:WorkingDirectory` / `TestRunner:ReportsDirectory` set in its own `appsettings.local.json` (gitignored) pointing at the Acceptance project and a reports output folder. It can also dispatch runs to GitHub Actions instead of running `dotnet test` as a local subprocess (see `GitHub:*` config / `.github/workflows/run-tests-dispatch.yml`) — that path needs a `GitHub:Token` (PAT with Actions read/write), set via env var or `appsettings.local.json`, never committed.

### Run the Contact Function locally
```
cd GwuxDesign.ContactFunction
func start   # Azure Functions Core Tools; needs a local.settings.json with the secrets above
```

## CI

`.github/workflows/pr-tests.yml` runs on PRs into `alpha1`/`main`: serves the site with `python3 -m http.server`, runs the acceptance suite (`TestCategory!=Example`) against it, and separately builds the Contact Function (build-only, no tests). `.github/workflows/run-tests-dispatch.yml` is a manually-dispatchable workflow that runs the same suite against either `local` (serves the site itself) or `online` (the live `www.gwuxdesign.co.uk`) — this is what `TestRunner.Web`'s GitHub Actions run mode triggers. `.github/workflows/deploy-testrunner-web.yml` deploys `TestRunner.Web` to Azure App Service on pushes to `main` touching that path.

## Architecture notes specific to this repo

- **No shared templating**: every HTML page duplicates its own header/nav/footer/theme-init boilerplate. There's no include mechanism — a nav or footer change means editing every page in `pages/*/index.html`, `pages/blog/post.html`, `index.html`, and `404.html` individually.
- **Content is data, not code**: adding a project or changing skills/software listings is a JSON edit in `assets/data/`, not a JS change. Adding a blog post means adding an entry to `assets/data/posts.json` (`slug`, `title`, `date`, `summary`, `image`, `file`) plus the corresponding Markdown file in `posts/`.
- **Any page that calls `fetchJSON`/`fetchText`/`escapeHtml`/`formatDate` must load `/assets/js/utils.js` before its own page script** — not all pages did historically (this has been a real, reproducible bug source), so check the `<script>` order at the bottom of the `<body>` when adding new pages or wiring a page's JS to these helpers.
- **CDN scripts use SRI** (`marked`, `DOMPurify` in `pages/blog/post.html`) — if bumping either version, the `integrity` hash must be recomputed from the actual fetched file (e.g. `openssl dgst -sha384 -binary <file> | openssl base64 -A`), not typed from memory; a wrong hash silently blocks the script and breaks blog post rendering with no obvious error beyond a console message.
- **The Contact Function only emails the site owner** — it does not send a confirmation/auto-reply to the form submitter (removed deliberately; an auto-reply that echoes attacker-supplied content back to an attacker-supplied address is an open email-relay abuse vector). The frontend (`assets/js/contact.js`) shows its own "message sent" confirmation instead.
- **`TestFilterBuilder`** (`GwuxDesign.PRAT/TestRunner.Web/Services/TestFilterBuilder.cs`) is the single place that turns a suite/tag string into a `dotnet test --filter` expression (comma-separated tags → OR'd `TestCategory=` clauses) — shared between the local-run path (`TestRunnerService`) and the GitHub Actions dispatch path (`GitHubActionsService`), so a run behaves the same regardless of where it executes.
- **`GwuxDesign.PRAT` is a template-in-place**: its README documents a "rename `GwuxDesign` to your project name" workflow for reuse elsewhere, but the checked-in Features/Pages/StepDefinitions are specific to this site. `Support/CredentialReader.cs`/`Credentials.cs`/`credentials.json` exist as template scaffolding for a login flow this site doesn't have (no feature currently uses them).
