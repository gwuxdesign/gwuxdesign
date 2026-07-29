@Smoke @ExampleFeature
Feature: Example feature

  # This is an example feature file - replace with your own scenarios
  # Feature files are written in Gherkin and describe the behaviour of your application
  # Each scenario maps to a test case and each step maps to a step definition in StepDefinitions/

  Background:
    Given the user navigates to the application

  Scenario: Example scenario
    When the user clicks the example button
    Then the user should see the example heading

  Scenario Outline: Example scenario outline with parameters
    When the user clicks the example button
    Then the user should see the example heading

    Examples:
      | parameter |
      | value1    |
      | value2    |