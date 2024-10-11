Feature: Tabslider Component

  Scenario: API call and data filtering
    Given I am on the Tabslider screen
    When the get API call takes place
    Then the data should be filtered based on route name
    And the FlatList should render the filtered data

  Scenario: Catching and logging error if getAllStudents API call fails
    Given the getAllStudents API call fails
    When the Form component is rendered
    Then the error should be caught and logged

  Scenario: Checking the flatlist is rendering correctly or not
    When the Tabslider component is rendered
    Then the FlatList should be rendered

  Scenario: Checking the flatlist data is rendering correctly or not
    When the Tabslider component is rendered
    Then the FlatList should be rendered with correct data  

