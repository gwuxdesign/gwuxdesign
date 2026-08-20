@Smoke @Navigation
Feature: Navigation

  Background:
    Given the user navigates to the application

  Scenario Outline: Navigating to each page via the header
    When the user clicks the "<Link>" nav link
    Then the browser should be on the "<Path>" page

    Examples:
      | Link     | Path             |
      | Profile  | /pages/profile/  |
      | Projects | /pages/projects/ |
      | Contact  | /pages/contact/  |

  Scenario Outline: Toggling colour theme switches between light and dark
    Given the theme is set to "<StartingTheme>"
    When the user toggles the colour theme
    Then the theme should be "<EndingTheme>"

    Examples:
      | StartingTheme | EndingTheme |
      | light         | dark        |
      | dark          | light       |
