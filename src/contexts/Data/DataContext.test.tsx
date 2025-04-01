import {
  WeatherFailureModel,
  WeatherSuccessModel,
} from '@/modules/Weather/WeatherModel';
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
  it('should initialize with default values', () => {
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

  it('should update weather state with success data', () => {
    const successWeather: WeatherSuccessModel = {
      cod: 200,
      coord: {
        lon: -0.1257,
        lat: 51.5085,
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      base: 'stations',
      main: {
        temp: 17.5,
        feels_like: 16.8,
        temp_min: 15,
        temp_max: 20,
        pressure: 1015,
        humidity: 65,
        sea_level: 1015,
        grnd_level: 1014,
      },
      visibility: 10000,
      wind: {
        speed: 5.66,
        deg: 80,
      },
      clouds: {
        all: 0,
      },
      dt: 1711972800,
      sys: {
        type: 1,
        id: 1414,
        country: 'GB',
        sunrise: 1711972800,
        sunset: 1712016000,
      },
      timezone: 3600,
      id: 2643743,
      name: 'London',
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
      contextValue.setWeather?.(successWeather);
    });

    const weatherElement = screen.getByTestId('weather');
    const weatherData = JSON.parse(weatherElement.textContent || '{}');

    expect(weatherData).toEqual({
      cod: 200,
      name: 'London, GB',
      main: 'Clear',
      description: 'clear sky',
      temperature: '15°C ~ 20°C',
      humidity: '65%',
      time: '2024-04-01 12:00:00',
    });
  });

  it('should handle weather failure data', () => {
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
    const weatherData = JSON.parse(weatherElement.textContent || '{}');

    expect(weatherData).toEqual({
      cod: 404,
      message: 'City not found',
    });
  });

  it('should update search history when weather is successfully fetched', () => {
    const successWeather: WeatherSuccessModel = {
      cod: 200,
      coord: {
        lon: -0.1257,
        lat: 51.5085,
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      base: 'stations',
      main: {
        temp: 17.5,
        feels_like: 16.8,
        temp_min: 15,
        temp_max: 20,
        pressure: 1015,
        humidity: 65,
        sea_level: 1015,
        grnd_level: 1014,
      },
      visibility: 10000,
      wind: {
        speed: 5.66,
        deg: 80,
      },
      clouds: {
        all: 0,
      },
      dt: 1711972800,
      sys: {
        type: 1,
        id: 1414,
        country: 'GB',
        sunrise: 1711972800,
        sunset: 1712016000,
      },
      timezone: 3600,
      id: 2643743,
      name: 'London',
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
      contextValue.setWeather?.(successWeather);
    });

    const searchHistoryElement = screen.getByTestId('searchHistory');
    const searchHistory = JSON.parse(searchHistoryElement.textContent || '[]');

    expect(searchHistory).toHaveLength(1);
    expect(searchHistory[0]).toEqual({
      key: 'London, GB',
      date: '2024-04-01 12:00:00',
    });
  });
});
