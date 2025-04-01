import React from 'react';
import GetWeatherForm from './GetWeatherForm';
import GetWeatherResult from './GetWeatherResult';

export const mockResultSuccess = {
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

export const mockResultFailure = { cod: '404', message: 'city not found' };

const GetWeather: React.FC = () => {
  return (
    <div className="">
      <GetWeatherForm />
      <GetWeatherResult results={mockResultSuccess} />
    </div>
  );
};

export default GetWeather;
