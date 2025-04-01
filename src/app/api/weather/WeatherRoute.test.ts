/**
 * @jest-environment jest-environment-node
 */

import { NextRequest } from 'next/server';
import { GET } from './WeatherRoute';

const mockGetCityWeather = jest.fn();
jest.mock('../../../modules/Weather/WeatherService', () => ({
  getCityWeather: (value: any) => mockGetCityWeather(value),
}));

const mockLoggerError = jest.fn();
jest.mock('../../../lib/logger', () => ({
  logger: { error: (...value: any) => mockLoggerError(...value) },
}));

describe('WeatherRoute: /api/weather', () => {
  describe('GET', () => {
    const mockSearchParamsGet = jest.fn();
    const mockCity = 'London';
    const mockCountry = 'GB';

    test('returns bad request as city is not given', async () => {
      const req: NextRequest = {
        nextUrl: { searchParams: { get: mockSearchParamsGet } },
      } as unknown as NextRequest;

      const response = await GET(req);

      expect(response.status).toBe(400);
      expect(mockGetCityWeather).not.toHaveBeenCalled();
      expect(mockLoggerError).toHaveBeenCalledTimes(1);
      expect(mockLoggerError).toHaveBeenCalledWith(
        'Validation error in GET /weather route',
        [
          {
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
            path: ['city'],
            received: 'undefined',
          },
        ],
      );
    });

    test('returns system error as mockGetCityWeather throws error', async () => {
      mockSearchParamsGet.mockImplementation((value: string) => {
        if (value === 'city') {
          return mockCity;
        }
        return null;
      });

      mockGetCityWeather.mockRejectedValueOnce('Test Error');

      const req: NextRequest = {
        nextUrl: { searchParams: { get: mockSearchParamsGet } },
      } as unknown as NextRequest;

      const response = await GET(req);

      expect(response.status).toBe(500);
      expect(mockLoggerError).toHaveBeenCalledTimes(1);
      expect(mockLoggerError).toHaveBeenCalledWith(
        'in GET /weather route',
        'Test Error',
      );
    });

    test('returns value from mockGetCityWeather', async () => {
      mockSearchParamsGet.mockImplementation((value: string) => {
        if (value === 'city') {
          return mockCity;
        }
        if (value === 'country') {
          return mockCountry;
        }
        return null;
      });

      mockGetCityWeather.mockResolvedValueOnce(['value']);

      const req: NextRequest = {
        nextUrl: { searchParams: { get: mockSearchParamsGet } },
      } as unknown as NextRequest;

      const response = await GET(req);

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject(['value']);
      expect(mockLoggerError).not.toHaveBeenCalled();
      expect(mockGetCityWeather).toHaveBeenCalledTimes(1);
      expect(mockGetCityWeather).toHaveBeenCalledWith({
        city: mockCity,
        country: mockCountry,
      });
    });
  });
});
