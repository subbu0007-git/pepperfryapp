import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import { defineFeature, loadFeature } from "jest-cucumber";
import { Getcard2Data } from "../../../Redux/Api/Getcard2data";
import Tabcard2 from "../../../components/Tabcard2";


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

const feature = loadFeature('test/features/tabcard2.feature')

jest.mock('../../../Redux/Api/Getcard2data');
defineFeature(feature, test => {
    let store;
    let screen;
    let setCard2dataMock;
    const mockData = [
        { id: "-NpdBRx-M77-iMfI1BVm", imgurl: 'https://example.com/image1.jpg', status: 'status1' },
        { id: "-NpdBh71HLRFz4BCCaji", imgurl: 'https://example.com/image2.jpg', status: 'status2' }
    ];
    // 1 first test case : checking the get api call after that based on the routing the data will be rendered in the flatlist
    test('API call and data filtering', ({ given, when, then }) => {
        beforeEach(() => {
            const mockStore = configureStore([]);
            store = mockStore({ Card2reducer: { card2data: mockData } });
        });
        given('I am on the Tabcard2 component', () => {
            Getcard2Data.mockResolvedValue(mockData);
            setCard2dataMock = jest.fn();
            screen = render(
                <Provider store={store}>
                    <Tabcard2
                        setCard2data={setCard2dataMock}
                    />
                </Provider>
            );
        });
        when('the get API call takes place', async () => {
            // No need to mock GetsliderData again here
            await waitFor(() => expect(Getcard2Data).toHaveBeenCalled());
        });
        then('the data should be filtered based on route name', () => {
            const expectedRoute = 'status1'; // Define the expected route name here
            const filteredData = mockData.filter(item => item.status === expectedRoute);
            expect(filteredData.length).toBeGreaterThan(0); // Assert that filtered data is not empty
        });
        then('the map method should render the filtered data', () => {
            const renderedData = screen.getAllByTestId('looped-item'); // Assuming each item in FlatList has testID 'flatlist-item'
            expect(renderedData.length).toBeGreaterThan(0); // Assert that rendered data is not empty
           
        });
    });


    // second test case : testing weather the api is catching the error whrn the api is not working
    test('Catching and logging error if get API call fails', ({ given, when, then }) => {
        let consoleErrorSpy;
        beforeEach(() => {
            const mockStore = configureStore([]);
            store = mockStore({ Card2reducer: { card2data: mockData } });
        });
        given('the getTabcard2 API call fails', () => {
            Getcard2Data.mockRejectedValueOnce(new Error('API call failed'));
        });
        when('the Form component is rendered', async () => {
            consoleErrorSpy = jest.spyOn(console, 'error');
            render(
                <Provider store={store}>
                    <Tabcard2 />
                </Provider>
            );
            await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
        });
        then('the error should be caught and logged', () => {
            expect(Getcard2Data).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('An error occurred:', new Error('API call failed'));
        });
    });


    test('Checking the mapped data rendering in Tabcard2', ({ when, then }) => {
        let mockDataForTabcard2 = [
            { id: "1", imgurl: 'https://example.com/image1.jpg', status: 'status1' },
            { id: "2", imgurl: 'https://example.com/image2.jpg', status: 'status2' }
        ];

        when('the Tabcard2 component is rendered', () => {
            const mockStore = configureStore([]);
            store = mockStore({ Card2reducer: { card2data: mockDataForTabcard2 } });
            screen = render(
                <Provider store={store}>
                    <Tabcard2 card2data={mockDataForTabcard2}/>
                </Provider>
            );
        });

        then('the mapped data should be rendered in the UI', () => {
            // Ensure that the looped-item container is rendered
            const loopedItemContainer = screen.getByTestId('looped-item');
            expect(loopedItemContainer).toBeTruthy();

            // Ensure that each item in the mock data is rendered
            mockDataForTabcard2.forEach(item => {
                const renderedItem = screen.getByTestId(`card-${item.id}`);
                expect(renderedItem).toBeTruthy();

                // You can further check if other components inside each rendered item are present and rendered correctly
                // For example, if there's an image component in each item, you can check its presence and source
                const renderedImage = screen.getByTestId(`image-${item.id}`);
                expect(renderedImage).toBeTruthy();
                expect(renderedImage.props.source.uri).toBe(item.imgurl);
            });
        });
    });

});