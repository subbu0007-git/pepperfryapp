Feature: Tabcard2 Component

  Scenario: API call and data filtering
    Given I am on the Tabcard2 component
    When the get API call takes place
    Then the data should be filtered based on route name
    And the map method should render the filtered data

  Scenario: Catching and logging error if get API call fails
    Given the getTabcard2 API call fails
    When the Form component is rendered
    Then the error should be caught and logged

  Scenario: Checking the mapped data rendering in Tabcard2
    When the Tabcard2 component is rendered
    Then the mapped data should be rendered in the UI