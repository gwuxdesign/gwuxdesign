# Changelog

## [1.0.1] - 2026-06-18

### Minor Clean-Up

This small release removes a redundant folder that was left behind from the original conversion.

## [1.0.0] - 2026-06-18

### Initial Template Release

This release converts the ClientPortal.PRAT project into a generic reusable template.

#### Changes
- Renamed `ClientPortal.PRAT.Acceptance` to `GwuxDesign.PRAT.Acceptance`
- Updated all namespaces from `ClientPortal.PRAT.Acceptance` to `GwuxDesign.PRAT.Acceptance`
- Replaced Client Portal specific page objects with `ExamplePage.cs`
- Replaced Client Portal specific step definitions with `ExampleSteps.cs`
- Replaced Client Portal specific feature files with `Example.feature`
- Stripped `PageImports.cs` to a single example entry
- Stripped `reqnroll.json` tag mapping to generic examples
- Replaced environment names `REL`, `QA2`, `DEV` with `ENV1`, `ENV2`, `ENV3`
- Updated README to reflect template usage including Rename the Project section
- Removed machine-specific local config files
- Cleaned up `.sln` file removing stale project references and adding `TestRunner.Web`