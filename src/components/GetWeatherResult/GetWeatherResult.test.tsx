import { DataContext } from '@/contexts/Data';
import {
  MOCK_WEATHER_DISPLAY_FAILURE,
  MOCK_WEATHER_DISPLAY_SUCCESS,
} from '@/lib/mocks';
import { render, screen } from '@testing-library/react';
import GetWeatherResult from './GetWeatherResult';

describe('GetWeatherResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders weather information correctly when data is available', () => {
    render(
      <DataContext.Provider value={{ weather: MOCK_WEATHER_DISPLAY_SUCCESS }}>
        <GetWeatherResult />
      </DataContext.Provider>,
    );

    expect(screen.getByText('London, GB')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();

    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
    expect(screen.getByText('Temperature:')).toBeInTheDocument();
    expect(screen.getByText('284.82°C ~ 286.47°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity:')).toBeInTheDocument();
    expect(screen.getByText('56%')).toBeInTheDocument();
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('2025-04-02, 1:16 AM')).toBeInTheDocument();
  });

  test('renders error message when no data is found', () => {
    render(
      <DataContext.Provider value={{ weather: MOCK_WEATHER_DISPLAY_FAILURE }}>
        <GetWeatherResult />
      </DataContext.Provider>,
    );
    expect(screen.getByText('City not found')).toBeInTheDocument();
  });
});
