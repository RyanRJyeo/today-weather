'use client';

import GetWeatherForm from '@/components/GetWeatherForm';
import GetWeatherResult from '@/components/GetWeatherResult';
import SearchHistoryList from '@/components/SearchHistoryList';
import { DataProvider } from '@/contexts/Data';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <DataProvider>
      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-5 first:mt-0">
          Today's Weather
        </h2>
        <GetWeatherForm />
        <GetWeatherResult />
      </div>
      <div className="mt-10 p-4 rounded-s-lg rounded-e-lg bg-gradient-to-b from-primary/20 to-background">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-5 first:mt-0">
          Search History
        </h2>
        <SearchHistoryList />
      </div>
    </DataProvider>
  );
};

export default HomePage;
