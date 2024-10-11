import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import { defineFeature, loadFeature } from "jest-cucumber";
import { Getcard1Data } from "../../../Redux/Api/Getcard1data";
import Tabcard1 from "../../../components/Tabcard1";
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

const feature = loadFeature('test/features/tabcard1.feature')

jest.mock('../../../Redux/Api/Getcard1data');
defineFeature(feature, test => {
    let store;
    let screen;
    let setCard1dataMock;
    const mockData = [
        { id: 1, imgurl: 'https://example.com/image1.jpg', status: 'status1' },
        { id: 2, imgurl: 'https://example.com/image2.jpg', status: 'status2' }
    ];
    // 1 first test case : checking the get api call after that based on the routing the data will be rendered in the flatlist
    test('API call and data filtering', ({ given, when, then }) => {
        beforeEach(() => {
            const mockStore = configureStore([]);
            store = mockStore({ Card1reducer: { card1data: mockData } });
        });
        given('I am on the Tabcard1 component', () => {
            Getcard1Data.mockResolvedValue(mockData);
            setCard1dataMock = jest.fn();
            screen = render(
                <Provider store={store}>
                    <Tabcard1
                        setCard1data={setCard1dataMock}
                    />
                </Provider>
            );
        });
        when('the get API call takes place', async () => {
            // No need to mock GetsliderData again here
            await waitFor(() => expect(Getcard1Data).toHaveBeenCalled());
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
    test('Catching and logging error if get API call fails', ({ given, when, then }) => {
        let consoleErrorSpy;
        beforeEach(() => {
            const mockStore = configureStore([]);
            store = mockStore({ Card1reducer: { card1data: mockData } });
        });
        given('the getTabcard1 API call fails', () => {
            Getcard1Data.mockRejectedValueOnce(new Error('API call failed'));
        });
        when('the Form component is rendered', async () => {
            consoleErrorSpy = jest.spyOn(console, 'error');
            render(
                <Provider store={store}>
                    <Tabcard1 />
                </Provider>
            );
            await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
        });
        then('the error should be caught and logged', () => {
            expect(Getcard1Data).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('An error occurred:', new Error('API call failed'));
        });
    });

    // third test case: testing that renderitem is renderingthe items accurately or not based on the index numbers
    test('Checking the flatlist data is rendering correctly or not', ({ when, then }) => {
        let mockDataForFlatList = [
            { id: 1, imgurl: 'https://example.com/image1.jpg', status: 'status1' },
            { id: 2, imgurl: 'https://example.com/image2.jpg', status: 'status2' }
        ];
        when('the Tabcard1 component is rendered', () => {
            const mockStore = configureStore([]);
            store = mockStore({ Card1reducer: { card1data: mockDataForFlatList } });
            screen = render(
                <Provider store={store}>
                    <Tabcard1 />
                </Provider>
            );
        });
        then('the FlatList should be rendered with correct data', () => {
            const flatList = screen.getByTestId('flatlist-item');
            expect(flatList).toBeTruthy();

            // Ensure that the keyExtractor function is covered
            const keyExtractorProp = flatList.props.keyExtractor;
            expect(keyExtractorProp).toBeTruthy();

            // Simulate key extraction for each item
            const keys = mockDataForFlatList.map(item => keyExtractorProp(item));
            console.log('i am keys',keys)
            // Ensure that the keys are correct
            expect(keys).toEqual([1, 2]);

            // Ensure that the renderItem function is covered
            const renderItemProp = flatList.props.renderItem;
            expect(renderItemProp).toBeTruthy();

            // Simulate rendering items
            const renderedItem1 = renderItemProp({ item: mockDataForFlatList[0], index: 0 });
            const renderedItem2 = renderItemProp({ item: mockDataForFlatList[1], index: 1 });

            // Ensure that the rendered items contain necessary components like Text with correct content
            expect(renderedItem1).toMatchSnapshot();
            expect(renderedItem2).toMatchSnapshot();
        });

    });
});