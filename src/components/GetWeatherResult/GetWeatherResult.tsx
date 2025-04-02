'use client';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useDataContext } from '@/contexts/Data/DataContext';
import React from 'react';

const GetWeatherResult: React.FC = () => {
  const { weather } = useDataContext();

  return (
    <div className="mt-7">
      {weather?.cod === 200 && (
        <div>
          <p className="text-muted-foreground">{weather.name}</p>
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary lg:text-5xl">
            {weather.main}
          </h1>

          <Table className="w-fit min-w-[346px] mt-4">
            <TableBody>
              {Object.entries({
                Description: weather.description,
                Temperature: weather.temperature,
                Humidity: weather.humidity,
                Time: weather.time,
              }).map((item) => {
                const [key, value] = item;

                return (
                  <TableRow key={key} className="border-none">
                    <TableCell className="w-fit p-1 pr-5 text-muted-foreground">
                      {key}:
                    </TableCell>
                    <TableCell className="p-1">{value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      {weather && weather.cod !== 200 && (
        <div className="w-full bg-red-200 border-red-400 rounded-lg border-solid text-black border-2 py-1 px-2">
          {weather.message}
        </div>
      )}
    </div>
  );
};

export default GetWeatherResult;
