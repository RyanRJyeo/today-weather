import { MOCK_WEATHER_SUCCESS } from '@/lib/mocks';
import { logger } from '../../../lib/logger';
import { getCityWeather } from './WeatherService';

// mock logger lib
jest.mock('../../../lib/logger');

// mock fetch API
global.fetch = jest.fn();

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
      const mockResponse = { ok: true, json: async () => MOCK_WEATHER_SUCCESS };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
      const res = await getCityWeather({
        city: 'London',
      });
      expect(res).toStrictEqual(MOCK_WEATHER_SUCCESS);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=London&appid=bd5e378503939ddaee76f12ad7a97608',
        { method: 'GET' },
      );
    });

    test('gets weather with both city and country', async () => {
      const mockResponse = { ok: true, json: async () => MOCK_WEATHER_SUCCESS };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
      const res = await getCityWeather({
        city: 'London',
        country: 'GB',
      });
      expect(res).toStrictEqual(MOCK_WEATHER_SUCCESS);
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
