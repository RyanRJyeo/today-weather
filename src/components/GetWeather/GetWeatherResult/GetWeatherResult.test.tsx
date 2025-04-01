import { formatDateTime } from '@/lib/formatDateTime';
import { MOCK_WEATHER_SUCCESS } from '@/lib/mocks';
import { WeatherFailureModel } from '@/modules/Weather/WeatherModel';
import { render, screen } from '@testing-library/react';
import GetWeatherResult from './GetWeatherResult';

// Mock the formatDateTime function
jest.mock('../../../lib/formatDateTime/formatDateTime', () => ({
  formatDateTime: jest
    .fn()
    .mockReturnValue({ dateTime: '2024-04-01 12:00:00' }),
}));

describe('GetWeatherResult', () => {
  const mockErrorData = {
    cod: 404,
    message: 'City not found',
  } as WeatherFailureModel;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders weather information correctly when data is available', () => {
    render(<GetWeatherResult results={MOCK_WEATHER_SUCCESS} />);

    // Check location
    expect(screen.getByText('London, GB')).toBeInTheDocument();

    // Check weather main
    expect(screen.getByText('Clouds')).toBeInTheDocument();

    // Check table content
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('broken clouds')).toBeInTheDocument();
    expect(screen.getByText('Temperature:')).toBeInTheDocument();
    expect(screen.getByText('281.24°C ~ 283.72°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity:')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('2024-04-01 12:00:00')).toBeInTheDocument();

    expect(formatDateTime).toHaveBeenCalledWith(MOCK_WEATHER_SUCCESS.dt * 1000);
  });

  it('renders error message when no data is found', () => {
    render(<GetWeatherResult results={mockErrorData} />);
    expect(screen.getByText('City not found')).toBeInTheDocument();
  });
});
