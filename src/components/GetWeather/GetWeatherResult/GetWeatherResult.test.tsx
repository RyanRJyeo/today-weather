import { formatDateTime } from '@/lib/formatDateTime';
import {
  WeatherFailureModel,
  WeatherSuccessModel,
} from '@/modules/Weather/WeatherModel';
import { render, screen } from '@testing-library/react';
import GetWeatherResult from './GetWeatherResult';

// Mock the formatDateTime function
jest.mock('../../../lib/formatDateTime/formatDateTime', () => ({
  formatDateTime: jest
    .fn()
    .mockReturnValue({ dateTime: '2024-04-01 12:00:00' }),
}));

describe('GetWeatherResult', () => {
  const mockSuccessData = {
    cod: 200,
    name: 'London',
    sys: {
      country: 'GB',
    },
    weather: [
      {
        main: 'Clouds',
        description: 'scattered clouds',
      },
    ],
    main: {
      temp_min: 15,
      temp_max: 20,
      humidity: 65,
    },
  } as WeatherSuccessModel;

  const mockErrorData = {
    cod: 404,
    message: 'City not found',
  } as WeatherFailureModel;

  const mockDate = new Date('2024-04-01T12:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the Date constructor
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterEach(() => {
    // Restore the original Date constructor
    jest.restoreAllMocks();
  });

  it('renders weather information correctly when data is available', () => {
    render(<GetWeatherResult results={mockSuccessData} />);

    // Check location
    expect(screen.getByText('London, GB')).toBeInTheDocument();

    // Check weather main
    expect(screen.getByText('Clouds')).toBeInTheDocument();

    // Check table content
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('scattered clouds')).toBeInTheDocument();
    expect(screen.getByText('Temperature:')).toBeInTheDocument();
    expect(screen.getByText('15°C ~ 20°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity:')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('2024-04-01 12:00:00')).toBeInTheDocument();
  });

  it('renders error message when no data is found', () => {
    render(<GetWeatherResult results={mockErrorData} />);
    expect(screen.getByText('City not found')).toBeInTheDocument();
  });

  it('calls formatDateTime with mocked date', () => {
    render(<GetWeatherResult results={mockSuccessData} />);
    expect(formatDateTime).toHaveBeenCalledWith(mockDate);
  });
});
