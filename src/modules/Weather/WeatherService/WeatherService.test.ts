import { logger } from '../../../lib/logger';
import { getCityWeather } from './WeatherService';

// mock logger lib
jest.mock('../../../lib/logger');

// mock fetch API
global.fetch = jest.fn();

const mockResultSuccess = {
  coord: {
    lon: -0.1257,
    lat: 51.5085,
  },
  weather: [
    {
      id: 803,
      main: 'Clouds',
      description: 'broken clouds',
      icon: '04d',
    },
  ],
  base: 'stations',
  main: {
    temp: 282.74,
    feels_like: 279.99,
    temp_min: 281.24,
    temp_max: 283.72,
    pressure: 1027,
    humidity: 80,
    sea_level: 1027,
    grnd_level: 1023,
  },
  visibility: 10000,
  wind: {
    speed: 5.66,
    deg: 80,
  },
  clouds: {
    all: 75,
  },
  dt: 1743496516,
  sys: {
    type: 2,
    id: 2091269,
    country: 'GB',
    sunrise: 1743485731,
    sunset: 1743532371,
  },
  timezone: 3600,
  id: 2643743,
  name: 'London',
  cod: 200,
};

describe('WeatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getCityWeather', () => {
    test('returns null because city is not given', async () => {
      const res = await getCityWeather(null as any);
      expect(res).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith('city not given');
    });

    test('returns null because mockFetch throws error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce('Test Error');
      const res = await getCityWeather({
        city: 'Dubai',
      });
      expect(res).toBeNull();
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=Dubai&appid=bd5e378503939ddaee76f12ad7a97608',
        { method: 'GET' },
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error in WeatherService getCityWeather method',
        { err: 'Test Error' },
      );
    });

    test('gets weather with only city', async () => {
      const mockResponse = { ok: true, json: async () => mockResultSuccess };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
      const res = await getCityWeather({
        city: 'London',
      });
      expect(res).toStrictEqual(mockResultSuccess);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=London&appid=bd5e378503939ddaee76f12ad7a97608',
        { method: 'GET' },
      );
    });

    test('gets weather with both city and country', async () => {
      const mockResponse = { ok: true, json: async () => mockResultSuccess };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
      const res = await getCityWeather({
        city: 'London',
        country: 'GB',
      });
      expect(res).toStrictEqual(mockResultSuccess);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=London,GB&appid=bd5e378503939ddaee76f12ad7a97608',
        { method: 'GET' },
      );
    });

    test('gets error result', async () => {
      const mockResponse = { ok: false, status: 404, statusText: 'Not Found' };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
      const res = await getCityWeather({
        city: 'London',
      });
      expect(res).toStrictEqual({ cod: 404, message: 'Not Found' });
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=London&appid=bd5e378503939ddaee76f12ad7a97608',
        { method: 'GET' },
      );
    });
  });
});
