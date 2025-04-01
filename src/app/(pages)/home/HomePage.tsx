import GetWeather from '@/components/GetWeather';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-[1280px] m-auto p-4">
      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-5 first:mt-0">
          Today's Weather
        </h2>
        <GetWeather />
      </div>
    </div>
  );
};

export default HomePage;
