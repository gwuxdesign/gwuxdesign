---
name: site-preview
description: Serve the gwuxdesign static site locally and screenshot specific pages across viewport widths and light/dark themes. Use before calling any visual/CSS/layout change done — screenshots catch layout bugs a diff won't show.
---

# Site preview

## 1. Serve the site

From the repo root:
```bash
(python3 -m http.server 5500 --directory "$CLAUDE_PROJECT_DIR" >/tmp/site-server.log 2>&1 &)
sleep 1
curl -s -o /dev/null -w "site up: %{http_code}\n" http://localhost:5500/
```
Always use port 5500 so a stale server from a previous task is easy to find and kill: `pkill -f "http.server 5500"`.

## 2. Screenshot with the Playwright MCP

The Playwright MCP plugin (`mcp__plugin_playwright_playwright__*`) is configured to launch the Chromium already installed at `~/.cache/ms-playwright/chromium-1208` (see its `.mcp.json` — do not change this back to the `chrome` channel; there is no Chrome install on this machine, and reverting it reintroduces `Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome`).

For each page/viewport/theme combination:
1. `browser_navigate` to `http://localhost:5500/<page>`
2. To check a specific theme: `browser_evaluate` with `() => localStorage.setItem('theme', '<dark|light>')`, then navigate again — theme is read from `localStorage` on page load, so it has to be set on a prior page load, not the one you're inspecting.
3. `browser_resize` to the width/height you want to check.
4. `browser_take_screenshot` — use `fullPage: true` unless you specifically want just the viewport crop.

## 3. This site's breakpoints

Defined in `assets/css/style.css`:
- `max-width: 500px` — post/project cards drop from a 2-column (image + text) layout to stacked
- `max-width: 720px` — header nav collapses into the hamburger menu
- `min-width: 560px` — post hero image starts floating right of the body text
- `min-width: 700px` — profile page switches from stacked to a 2-column (about+software / photo+skills) grid

When checking a responsive change, screenshot at least one width below and one above the relevant breakpoint — a bug that only shows up in the 10px window around a breakpoint is a real, recurring failure mode in this codebase (see the profile-page grid-row bug from this site's own history).

## 4. If the Playwright MCP is unavailable

Fall back to a throwaway Playwright .NET driver — Playwright 1.58.0 is already available via `GwuxDesign.PRAT.Acceptance`'s package references, and browsers are pre-installed at `~/.cache/ms-playwright/`:

```bash
mkdir -p /tmp/preview-probe && cd /tmp/preview-probe
cat > probe.csproj <<'EOF'
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Playwright" Version="1.58.0" />
  </ItemGroup>
</Project>
EOF
```
Then a `Program.cs` that launches Chromium, sets the theme via `page.AddInitScriptAsync("localStorage.setItem('theme', '...')")`, sets the viewport via `BrowserNewContextOptions.ViewportSize`, and calls `page.ScreenshotAsync(new() { Path = ..., FullPage = true })`. Delete `/tmp/preview-probe` when done.

## 5. Clean up

Kill the local server when finished: `pkill -f "http.server 5500"`. Don't leave it running between tasks.
