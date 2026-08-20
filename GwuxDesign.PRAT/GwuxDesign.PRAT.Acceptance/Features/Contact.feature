@Smoke @Contact
Feature: Contact page

  Background:
    Given the user navigates to the application
    And the user navigates to the "Contact" page

  Scenario: Viewing the contact form
    Then the contact form should be displayed

  Scenario Outline: Submitting with a missing or invalid field shows a validation error
    When the user submits the contact form with name "<Name>" email "<Email>" and message "<Message>"
    Then the "<Field>" field should show the error "<ErrorMessage>"

    Examples:
      | Name | Email             | Message | Field   | ErrorMessage                        |
      |      | jane@example.com  | Hello   | name    | Please enter your name.             |
      | Jane | not-an-email      | Hello   | email   | Please enter a valid email address. |
      | Jane | jane@example.com  |         | message | Please enter a message.             |