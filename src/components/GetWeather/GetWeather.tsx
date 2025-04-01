'use client';

import {
  WeatherFailureModel,
  WeatherSuccessModel,
} from '@/modules/Weather/WeatherModel';
import React, { useState } from 'react';
import GetWeatherForm from './GetWeatherForm';
import GetWeatherResult from './GetWeatherResult';

const GetWeather: React.FC = () => {
  const [weather, setWeather] = useState<
    WeatherSuccessModel | WeatherFailureModel | null
  >();

  return (
    <div>
      <GetWeatherForm setWeather={setWeather} />
      <GetWeatherResult results={weather} />
    </div>
  );
};

export default GetWeather;
