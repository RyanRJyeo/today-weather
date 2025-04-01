'use client';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDateTime } from '@/lib/formatDateTime';
import {
  WeatherFailureModel,
  WeatherSuccessModel,
} from '@/modules/Weather/WeatherModel';
import React, { useEffect, useState } from 'react';

interface ResultTable {
  Description: string;
  Temperature: string;
  Humidity: string;
  Time: string;
}
interface GetWeatherResultProps {
  results?: WeatherSuccessModel | WeatherFailureModel | null;
}
const GetWeatherResult: React.FC<GetWeatherResultProps> = (props) => {
  const { results } = props;
  const [resultTable, setResultTable] = useState<ResultTable | undefined>();
  const [weatherSuccess, setWeatherSuccess] = useState<
    WeatherSuccessModel | undefined
  >();
  const [weatherFailure, setWeatherFailure] = useState<
    WeatherFailureModel | undefined
  >();

  useEffect(() => {
    if (results?.cod === 200) {
      const weatherResults = results as WeatherSuccessModel;
      setWeatherSuccess(weatherResults);
      setResultTable({
        Description: weatherResults.weather[0].description,
        Temperature: `${weatherResults.main.temp_min}°C ~ ${weatherResults.main.temp_max}°C`,
        Humidity: `${weatherResults.main.humidity}%`,
        Time: formatDateTime(weatherResults.dt * 1000)?.dateTime,
      });
      setWeatherFailure(undefined);
    } else {
      setWeatherSuccess(undefined);
      setResultTable(undefined);
      setWeatherFailure(results as WeatherFailureModel);
    }
  }, [results]);

  return (
    <div className="mt-7">
      {weatherSuccess && resultTable && (
        <div>
          <p className="text-muted-foreground">
            {weatherSuccess.name}, {weatherSuccess.sys.country}
          </p>
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
            {weatherSuccess.weather[0].main}
          </h1>

          <Table className="w-fit min-w-[346px] mt-4">
            <TableBody>
              {Object.entries(resultTable).map((item) => {
                const [key, value] = item;

                return (
                  <TableRow key={key}>
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
      {weatherFailure && (
        <div className="w-full bg-red-300 border-red-800 border-solid border-2 py-1 px-2">
          {weatherFailure.message}
        </div>
      )}
    </div>
  );
};

export default GetWeatherResult;
