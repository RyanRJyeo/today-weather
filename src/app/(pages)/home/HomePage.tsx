'use client';

import GetWeatherForm from '@/components/GetWeatherForm';
import GetWeatherResult from '@/components/GetWeatherResult';
import {
  WeatherFailureModel,
  WeatherSuccessModel,
} from '@/modules/Weather/WeatherModel';
import React, { useState } from 'react';

const HomePage: React.FC = () => {
  const [weather, setWeather] = useState<
    WeatherSuccessModel | WeatherFailureModel | null
  >();

  return (
    <div className="max-w-[1280px] m-auto p-4">
      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-5 first:mt-0">
          Today's Weather
        </h2>
        <GetWeatherForm setWeather={setWeather} />
        <GetWeatherResult results={weather} />
      </div>
    </div>
  );
};

export default HomePage;
