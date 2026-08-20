@Smoke @Blog
Feature: Blog

  Background:
    Given the user navigates to the application

  Scenario: Viewing the list of blog posts on the homepage
    Then at least one post card should be displayed

  Scenario: Reading a blog post
    When the user clicks the "Rebuilding this site, properly this time" post link
    Then the post page should show the title "Rebuilding this site, properly this time"
    And the post content should be rendered as HTML, not raw Markdown
