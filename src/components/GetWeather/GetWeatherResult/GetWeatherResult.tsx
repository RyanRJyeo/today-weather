'use client';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDateTime } from '@/lib/formatDateTime';
import React, { useEffect, useState } from 'react';

interface ResultTable {
  Description: string;
  Temperature: string;
  Humidity: string;
  Time: string;
}
interface GetWeatherResultProps {
  results: any;
}
const GetWeatherResult: React.FC<GetWeatherResultProps> = (props) => {
  const { results } = props;
  const [resultTable, setResultTable] = useState<ResultTable | undefined>();

  useEffect(() => {
    if (results?.cod === 200) {
      setResultTable({
        Description: results.weather[0].description,
        Temperature: `${results.main.temp_min}°C ~ ${results.main.temp_max}°C`,
        Humidity: `${results.main.humidity}%`,
        Time: formatDateTime(new Date())?.dateTime,
      });
    } else {
      setResultTable(undefined);
    }
  }, [results]);

  return (
    <div className="mt-7">
      {results?.cod === 200 && resultTable ? (
        <div>
          <p className="text-muted-foreground">
            {results.name}, {results.sys.country}
          </p>
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
            {results.weather[0].main}
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
      ) : (
        <div className="w-full bg-red-300 border-red-800 border-solid border-2 py-1 px-2">
          Not Found
        </div>
      )}
    </div>
  );
};

export default GetWeatherResult;
