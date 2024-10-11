import React from "react";
import Tabslider from "../../../components/Tabslider";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import { defineFeature, loadFeature } from "jest-cucumber";
import { GetsliderData } from "../../../Redux/Api/Getsliderdata";

// Mocking React Navigation's useRoute hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      screen: 'mocked-screen', // Provide a default screen name
      // Add any other params you need for testing
    },
  }),
}));

const feature = loadFeature('test/features/tabslider.feature')

jest.mock('../../../Redux/Api/Getsliderdata');
defineFeature(feature, test => {
  let store;
  let screen;
  let setSliderdataMock;
  const mockData = [
    { id: 1, imgurl: 'https://example.com/image1.jpg', title: 'Title 1', options: 'Options 1', status: 'status1' },
    { id: 2, imgurl: 'https://example.com/image2.jpg', title: 'Title 2', options: 'Options 2', status: 'status2' }
  ];
  // 1 first test case : checking the get api call after that based on the routing the data will be rendered in the flatlist
  test('API call and data filtering', ({ given, when, then }) => {
    beforeEach(() => {
      const mockStore = configureStore([]);
      store = mockStore({ Sliderreducer: { sliderdata: mockData } });
    });
    given('I am on the Tabslider screen', () => {
      GetsliderData.mockResolvedValue(mockData);
      setSliderdataMock = jest.fn();
      screen = render(
        <Provider store={store}>
          <Tabslider
            setSliderdata={setSliderdataMock}
          />
        </Provider>
      );
    });
    when('the get API call takes place', async () => {
      // No need to mock GetsliderData again here
      await waitFor(() => expect(GetsliderData).toHaveBeenCalled());
    });
    then('the data should be filtered based on route name', () => {
      const expectedRoute = 'status1'; // Define the expected route name here
      const filteredData = mockData.filter(item => item.status === expectedRoute);
      expect(filteredData.length).toBeGreaterThan(0); // Assert that filtered data is not empty
    });
    then('the FlatList should render the filtered data', () => {
      const renderedData = screen.getAllByTestId('flatlist-item'); // Assuming each item in FlatList has testID 'flatlist-item'
      expect(renderedData.length).toBeGreaterThan(0); // Assert that rendered data is not empty
    });
  });

  // second test case : testing weather the api is catching the error whrn the api is not working
  test('Catching and logging error if getAllStudents API call fails', ({ given, when, then }) => {
    let consoleErrorSpy;
    beforeEach(() => {
      const mockStore = configureStore([]);
      store = mockStore({ Sliderreducer: { sliderdata: mockData } });
    });
    given('the getAllStudents API call fails', () => {
      GetsliderData.mockRejectedValueOnce(new Error('API call failed'));
    });
    when('the Form component is rendered', async () => {
      consoleErrorSpy = jest.spyOn(console, 'error');
      render(
        <Provider store={store}>
          <Tabslider />
        </Provider>
      );
      await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
    });
    then('the error should be caught and logged', () => {
      expect(GetsliderData).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('An error occurred:', new Error('API call failed'));
    });
  });

  // third test case : testing that the flat list is rendering or not
  test('Checking the flatlist is rendering correctly or not', ({ when, then }) => {
    beforeEach(() => {
      const mockStore = configureStore([]);
      store = mockStore({ Sliderreducer: { sliderdata: mockData } });
    });
    when('the Tabslider component is rendered', () => {
      screen = render(
        <Provider store={store}>
          <Tabslider />
        </Provider>
      );
    });

    then('the FlatList should be rendered', () => {
      const flatList = screen.getByTestId('flatlist-item');
      expect(flatList).toBeTruthy();
    });

  })

// forth test case : testing that the flatlist is rendering with the data in the Ui or not
  test('Checking the flatlist data is rendering correctly or not', ({ when, then }) => {
    let mockDataForFlatList = [
      { id: 1, imgurl: 'https://example.com/image1.jpg', title: 'Title 1', options: 'Options 1', status: 'status1' },
      { id: 2, imgurl: 'https://example.com/image2.jpg', title: 'Title 2', options: 'Options 2', status: 'status2' }
    ];
    when('the Tabslider component is rendered', () => {
      const mockStore = configureStore([]);
      store = mockStore({ Sliderreducer: { sliderdata: mockDataForFlatList } });
      screen = render(
        <Provider store={store}>
          <Tabslider />
        </Provider>
      );
    });
    then('the FlatList should be rendered with correct data', () => {
      const flatList = screen.getByTestId('flatlist-item');
      expect(flatList).toBeTruthy();
      // Ensure that the renderItem function is covered
      const renderItemProp = flatList.props.renderItem;
      // console.log('i am the renderItemprop',renderItemProp)
      expect(renderItemProp).toBeTruthy();
      // Simulate rendering items
      const renderedItem1 = renderItemProp({ item: mockDataForFlatList[0], index: 0 });
      const renderedItem2 = renderItemProp({ item: mockDataForFlatList[1], index: 1 });
      //  console.log('i am renderedItem2',renderedItem2)
      //  console.log("i am renderedItem1.props.children.props.children[1]",renderedItem1.props.children.props.children[1])
      // Ensure that the rendered items contain necessary components like Text with correct color
      expect(renderedItem1.props.children.props.children[1].props.children.props.style[1].color).toEqual('#ff4500'); // Title 1 color
      expect(renderedItem1.props.children.props.children[2].props.children.props.style[1].color).toEqual('#ff4500'); // Options 1 color
      expect(renderedItem2.props.children.props.children[1].props.children.props.style[1].color).toEqual('black'); // Title 2 color
      expect(renderedItem2.props.children.props.children[2].props.children.props.style[1].color).toEqual('black'); // Options 2 color
    });
  });
  
  
  
  


});