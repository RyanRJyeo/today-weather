import { logger } from '@/lib/logger';
import getConfig from 'next/config';
import {
  GetWeatherValues,
  WeatherFailureModel,
  WeatherSuccessModel,
} from '../WeatherModel';

const { publicRuntimeConfig } = getConfig();
const { appid } = publicRuntimeConfig || {};

export const getCityWeather = async (
  params: GetWeatherValues,
): Promise<WeatherSuccessModel | WeatherFailureModel | null> => {
  try {
    const { city, country } = params || {};
    if (!city) {
      logger.error('city not given');
      return null;
    }

    const query = country ? `${city},${country}` : city;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appid}`,
      {
        method: 'GET',
      },
    );

    if (!response?.ok) {
      return { cod: response.status, message: response.statusText };
    }

    return await response.json();
  } catch (err) {
    logger.error('Error in WeatherService getCityWeather method', { err });
    return null;
  }
};
