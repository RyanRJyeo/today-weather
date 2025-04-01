'use client';

import GetWeatherForm from '@/components/GetWeatherForm';
import GetWeatherResult from '@/components/GetWeatherResult';
import SearchHistoryList from '@/components/SearchHistoryList';
import { DataProvider } from '@/contexts/Data/DataContext';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <DataProvider>
      <div className="max-w-[1280px] m-auto p-4">
        <div>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-5 first:mt-0">
            Today's Weather
          </h2>
          <GetWeatherForm />
          <GetWeatherResult />
        </div>
        <div className="mt-10">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-5 first:mt-0">
            Search History
          </h2>
          <SearchHistoryList />
        </div>
      </div>
    </DataProvider>
  );
};

export default HomePage;
