Feature: Tabcard1 Component

  Scenario: API call and data filtering
    Given I am on the Tabcard1 component
    When the get API call takes place
    Then the data should be filtered based on route name
    And the FlatList should render the filtered data

  Scenario: Catching and logging error if get API call fails
    Given the getTabcard1 API call fails
    When the Form component is rendered
    Then the error should be caught and logged


  Scenario: Checking the flatlist data is rendering correctly or not
    When the Tabcard1 component is rendered
    Then the FlatList should be rendered with correct data