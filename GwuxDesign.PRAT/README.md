# Introduction
PRAT (Playwright Regression Automation Tool) is a .NET-based test automation framework template built on Playwright, Reqnroll, and NUnit, accompanied by a Blazor Server web application (TestRunner.Web) for triggering test runs and viewing reports.

This template is designed to be cloned and adapted for any web application project. Follow the setup steps below to get started.

See [CHANGELOG.md](CHANGELOG.md) for version history.

## Table of Contents
- [Getting Started](#getting-started)
- [VS Code Extensions](#vs-code-extensions)
- [Project Setup](#project-setup)
- [Build Project](#build-project)
- [Configure Playwright](#configure-playwright)
- [Testing](#testing)
- [References](#references)

# Getting Started
What you'll need:
1. .NET 10.0 SDK
2. IDE such as VS Code, Visual Studio or JetBrains Rider
3. Powershell (Not legacy Windows Powershell)

# VS Code Extensions
1. C# Extension by Microsoft (C# and C# Dev Kit)
2. Cucumber for Visual Studio Code
3. Playwright Test for VS Code
4. .NET Extension Pack
5. .NET Install Tool

# Project Setup

## Rename the Project
Before configuring anything, rename all instances of `GwuxDesign` to your project name. In VS Code use **Cmd+Shift+H** (Mac) or **Ctrl+Shift+H** (Windows) to do a global find and replace across the workspace:

- Search for: `GwuxDesign`
- Replace with: your project name e.g. `ClientPortal`

This covers namespaces, folder references, and configuration paths in one step. Also rename the following on disk:
- `GwuxDesign.PRAT.Acceptance/` folder
- `GwuxDesign.PRAT.Acceptance.csproj` file
- Update the `.sln` file reference to match

## Environments
Create `appsettings.local.json` in the `GwuxDesign.PRAT.Acceptance` folder with the following structure:

```json
{
  "Environments": {
    "ENV1": { "BaseUrl": "https://your-env1-url" },
    "ENV2": { "BaseUrl": "https://your-env2-url" },
    "ENV3": { "BaseUrl": "https://your-env3-url" }
  }
}
```

Replace `ENV1`, `ENV2`, `ENV3` with your environment names and update `appsettings.json` to match.

## Credentials
Create `credentials.local.json` in the `GwuxDesign.PRAT.Acceptance` folder with the following structure:

```json
{
  "Accounts": {
    "accountOne": { "Email": "your@email.com", "Password": "yourpassword" },
    "accountTwo": { "Email": "another@email.com", "Password": "anotherpassword" }
  }
}
```

Replace the account keys and values with credentials relevant to your project.

## Test Suite + Test Result Logging
Create `appsettings.local.json` in the `TestRunner.Web` folder with the following structure:

```json
{
  "TestRunner": {
    "WorkingDirectory": "/path/to/GwuxDesign.PRAT.Acceptance",
    "ReportsDirectory": "/path/to/GwuxDesign.PRAT.Acceptance/TestResults"
  }
}
```

## Enabling Gherkin
Open the project using the workspace file at the solution root:
`GwuxDesign.code-workspace`

This ensures the Cucumber extension resolves step definitions correctly. This can be done two ways:

### Option 1
1. In terminal, ensure you are in the project root. I.e. The folder containing the `.sln` file (Use command `pwd` to confirm)
2. Run command `code GwuxDesign.code-workspace`

### Option 2
1. In Windows File Explorer, navigate to the project root
2. Double click `GwuxDesign.code-workspace`

### Option 3
1. In VS Code, go to `File` -> `Open Workspace from File...`
2. Navigate to where the project is stored.
3. Select the file called `GwuxDesign.code-workspace` and open.


# Build Project
In a terminal, run the following commands from the solution root:
```
dotnet clean
dotnet restore
dotnet build
```

# Configure Playwright
- In a terminal, navigate to `GwuxDesign.PRAT.Acceptance` (Use command `cd GwuxDesign.PRAT.Acceptance`)
- Use the command: `pwsh bin/Debug/net10.0/playwright.ps1 install`

# Testing
## Test via Frontend
- In a terminal, navigate to `TestRunner.Web` (Use command `cd TestRunner.Web`)
- Use the command: `dotnet run`
- Open a browser and navigate to `https://localhost:5001` (Port number may vary — check terminal output)

## Test via Terminal
- In a terminal, run the following command from the solution root: `dotnet test GwuxDesign.PRAT.Acceptance`

## Configurable Command Parameters (for Terminal)
- `HEADED=1` - Run tests in headed mode (default is headless)
- `BROWSER=chromium` - Browser to use (chromium, firefox, webkit)
- `DEVICE_TYPE=Desktop` - Device type to emulate (Desktop, TabletVer, TabletHor, Mobile - default is Desktop)
- `ENVIRON=ENV1` - Environment to run tests against (default is ENV1)
- `RECORD_VIDEO=1` - Record video of test execution (default is off)
- `RECORD_TRACES=1` - Record Playwright traces (default is off)

Example command - `HEADED=1 BROWSER=firefox RECORD_VIDEO=1 dotnet test GwuxDesign.PRAT.Acceptance`

# References
1. https://dotnet.microsoft.com/en-us/download/dotnet/10.0
2. https://learn.microsoft.com/en-us/dotnet/core/install/
3. https://code.visualstudio.com/docs/languages/csharp
4. https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp
5. https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp-developer-kit
6. https://marketplace.visualstudio.com/items?itemName=cucumber.cucumber-vscode
7. https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright-test
8. https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.vscode-dotnet-pack
9. https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.vscode-dotnet-install-tool
10. https://playwright.dev/dotnet/docs/introduction
11. https://cucumber.io/docs/guides/10-minute-tutorial/
12. https://docs.reqnroll.net/latest/index.html