@Smoke @Profile
Feature: Profile page

  Background:
    Given the user navigates to the application
    And the user navigates to the "Profile" page

  Scenario: Viewing the About section
    Then the About heading should be visible

  Scenario: Skill bars match the skills data
    Then the number of skill bars should match the skills data

  Scenario: The LinkedIn link points to the correct profile
    Then the LinkedIn link should point to "https://www.linkedin.com/in/gregjswilliams/"

  Scenario: Software table renders grouped entries
    Then at least one software row should be displayed