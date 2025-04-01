import { formatDateTime } from '@/lib/formatDateTime';
import { MOCK_WEATHER_SUCCESS } from '@/lib/mocks';
import { WeatherFailureModel } from '@/modules/Weather/WeatherModel';
import { render, screen, waitFor } from '@testing-library/react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import GetWeatherResult from './GetWeatherResult';

jest.mock('../../hooks/useLocalStorage');

const mockFormattedDate = '2024-04-01, 12:00 PM';
jest.mock('../../lib/formatDateTime', () => ({
  formatDateTime: jest
    .fn()
    .mockReturnValue({ dateTime: '2024-04-01, 12:00 PM' }),
}));

const mockErrorData = {
  cod: 404,
  message: 'City not found',
} as WeatherFailureModel;

describe('GetWeatherResult', () => {
  let setSearchHistory: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    setSearchHistory = jest.fn();
    (useLocalStorage as jest.Mock).mockReturnValue([[], setSearchHistory]);
  });

  it('renders weather information correctly when data is available', () => {
    render(<GetWeatherResult results={MOCK_WEATHER_SUCCESS} />);

    expect(screen.getByText('London, GB')).toBeInTheDocument();

    expect(screen.getByText('Clouds')).toBeInTheDocument();

    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('broken clouds')).toBeInTheDocument();
    expect(screen.getByText('Temperature:')).toBeInTheDocument();
    expect(screen.getByText('281.24°C ~ 283.72°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity:')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText(mockFormattedDate)).toBeInTheDocument();

    expect(formatDateTime).toHaveBeenCalledWith(MOCK_WEATHER_SUCCESS.dt * 1000);
  });

  it('renders error message when no data is found', () => {
    render(<GetWeatherResult results={mockErrorData} />);
    expect(screen.getByText('City not found')).toBeInTheDocument();
  });
});

describe('GetWeatherResult LocalStorage', () => {
  let setSearchHistory: jest.Mock;

  beforeEach(() => {
    setSearchHistory = jest.fn();
    (useLocalStorage as jest.Mock).mockReturnValue([[], setSearchHistory]);
  });

  it('should store search history in localStorage when results are successful', async () => {
    render(<GetWeatherResult results={MOCK_WEATHER_SUCCESS} />);

    await waitFor(() => {
      expect(setSearchHistory).toHaveBeenCalledWith([
        { key: 'London, GB', date: mockFormattedDate },
      ]);
    });
  });

  it('should not update search history if the same city is searched again', async () => {
    (useLocalStorage as jest.Mock).mockReturnValue([
      [{ key: 'London, GB', date: mockFormattedDate }],
      setSearchHistory,
    ]);

    render(<GetWeatherResult results={MOCK_WEATHER_SUCCESS} />);

    await waitFor(() => {
      expect(setSearchHistory).toHaveBeenCalledWith([
        { key: 'London, GB', date: mockFormattedDate },
      ]);
    });
  });

  it('should handle failure case and not modify search history', async () => {
    render(<GetWeatherResult results={mockErrorData} />);

    await waitFor(() => {
      expect(setSearchHistory).not.toHaveBeenCalled();
    });

    expect(screen.getByText('City not found')).toBeInTheDocument();
  });
});
