import { MOCK_WEATHER_SUCCESS } from '@/lib/mocks';
import { SearchHistory } from '@/modules/Weather/SearchHistory/SearchHistoryModel';
import { WeatherFailureModel } from '@/modules/Weather/WeatherModel';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { DataProvider, useDataContext } from './DataContext';

// Mock the useLocalStorage hook
jest.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: () => {
    const [value, setValue] = React.useState<
      Array<{ key: string; date: string }>
    >([]);
    return [value, setValue];
  },
}));

// Mock the formatDateTime function
jest.mock('../../lib/formatDateTime', () => ({
  formatDateTime: () => ({
    dateTime: '2024-04-01 12:00:00',
  }),
}));

// Test component to access context
const TestComponent = ({
  onContextReady,
}: { onContextReady?: (context: any) => void }) => {
  const context = useDataContext();

  React.useEffect(() => {
    if (onContextReady) {
      onContextReady(context);
    }
  }, [context, onContextReady]);

  return (
    <div>
      <div data-testid="weather">{JSON.stringify(context.weather)}</div>
      <div data-testid="searchHistory">
        {JSON.stringify(context.searchHistory)}
      </div>
    </div>
  );
};

describe('DataContext', () => {
  test('initialize with default values', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    const weatherElement = screen.getByTestId('weather');
    const searchHistoryElement = screen.getByTestId('searchHistory');

    expect(weatherElement.textContent).toBe('');
    expect(searchHistoryElement.textContent).toBe('[]');
  });

  test('update weather state with success data', () => {
    let contextValue: any;
    render(
      <DataProvider>
        <TestComponent
          onContextReady={(context) => {
            contextValue = context;
          }}
        />
      </DataProvider>,
    );

    act(() => {
      contextValue.setWeather?.(MOCK_WEATHER_SUCCESS);
    });

    const weatherElement = screen.getByTestId('weather');
    const weatherData = JSON.parse(weatherElement.textContent ?? '{}');

    expect(weatherData).toEqual({
      cod: 200,
      description: 'broken clouds',
      humidity: '80%',
      main: 'Clouds',
      name: 'London, GB',
      temperature: '281.24°C ~ 283.72°C',
      time: '2024-04-01 12:00:00',
    });
  });

  test('handle weather failure data', () => {
    const failureWeather: WeatherFailureModel = {
      cod: 404,
      message: 'City not found',
    };

    let contextValue: any;
    render(
      <DataProvider>
        <TestComponent
          onContextReady={(context) => {
            contextValue = context;
          }}
        />
      </DataProvider>,
    );

    act(() => {
      contextValue.setWeather?.(failureWeather);
    });

    const weatherElement = screen.getByTestId('weather');
    const weatherData = JSON.parse(weatherElement.textContent ?? '{}');

    expect(weatherData).toEqual({
      cod: 404,
      message: 'City not found',
    });
  });

  test('update search history when weather is successfully fetched', () => {
    let contextValue: any;
    render(
      <DataProvider>
        <TestComponent
          onContextReady={(context) => {
            contextValue = context;
          }}
        />
      </DataProvider>,
    );

    act(() => {
      contextValue.setWeather?.(MOCK_WEATHER_SUCCESS);
    });

    const searchHistoryElement = screen.getByTestId('searchHistory');
    const searchHistory = JSON.parse(searchHistoryElement.textContent ?? '[]');

    expect(searchHistory).toHaveLength(1);
    expect(searchHistory[0]).toEqual({
      city: 'London',
      country: 'GB',
      key: 'London, GB',
      time: '12:00:00 pm',
    });
  });

  test('remove search history item from search history list', () => {
    let contextValue: any;
    render(
      <DataProvider>
        <TestComponent
          onContextReady={(context) => {
            contextValue = context;
          }}
        />
      </DataProvider>,
    );

    // add search history
    act(() => {
      contextValue.setWeather?.(MOCK_WEATHER_SUCCESS);
    });

    const searchHistoryElement = screen.getByTestId('searchHistory');
    const searchHistory: SearchHistory[] = JSON.parse(
      searchHistoryElement.textContent ?? '[]',
    );

    expect(searchHistory).toHaveLength(1);
    expect(searchHistory[0]).toEqual({
      city: 'London',
      country: 'GB',
      key: 'London, GB',
      time: '12:00:00 pm',
    });

    // remove search history
    act(() => {
      contextValue.removeSearch?.(searchHistory[0].key);
    });

    const nextSearchHistoryElement = screen.getByTestId('searchHistory');
    const nextSearchHistory: SearchHistory[] = JSON.parse(
      nextSearchHistoryElement.textContent ?? '[]',
    );

    expect(nextSearchHistory).toHaveLength(0);
  });
});
