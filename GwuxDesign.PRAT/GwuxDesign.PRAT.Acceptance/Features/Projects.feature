@Smoke @Projects
Feature: Projects page

  Background:
    Given the user navigates to the application

  Scenario: Viewing the list of projects
    When the user navigates to the "Projects" page
    Then at least one project card should be displayed

  Scenario: Every project card links to its correct URL
    When the user navigates to the "Projects" page
    Then every project card should link to the URL defined in the project data