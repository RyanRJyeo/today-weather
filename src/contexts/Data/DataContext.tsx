'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDateTime } from '@/lib/formatDateTime';
import { SearchHistory } from '@/modules/Weather/SearchHistory/SearchHistoryModel';
import {
  WeatherDisplayModel,
  WeatherFailureModel,
  WeatherSuccessModel,
} from '@/modules/Weather/WeatherModel';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

// ==================
// Context value
// ==================
type WeatherType = WeatherSuccessModel | WeatherFailureModel | null;

interface DataContextInterface {
  weather?: WeatherDisplayModel;
  setWeather?: (value: WeatherType) => void;
  searchHistory?: SearchHistory[];
  removeSearch?: (value: string) => void;
}

export const DataContext = createContext<DataContextInterface | null>(null);

// ==================
// Context provider
// ==================
interface DataProviderProps {
  children: ReactNode;
}
export const DataProvider = ({ children }: DataProviderProps) => {
  const [weather, setWeather] = useState<WeatherDisplayModel>();

  // localStorage states
  const [searchHistory, setSearchHistory] =
    useLocalStorage<SearchHistory[]>('searchHistory');

  const setFormattedWeather = (value: WeatherType) => {
    if (value?.cod === 200) {
      const successValue = value as WeatherSuccessModel;
      const name = `${successValue.name}, ${successValue.sys.country}`;
      const dateTime = formatDateTime(successValue.dt * 1000)?.dateTime;

      // set retrieved weather
      setWeather({
        cod: successValue.cod,
        name: name,
        main: successValue.weather[0].main,
        description: successValue.weather[0].description,
        temperature: `${successValue.main.temp_min}°C ~ ${successValue.main.temp_max}°C`,
        humidity: `${successValue.main.humidity}%`,
        time: dateTime,
      });

      // update search history
      const search: SearchHistory = {
        key: name,
        time: new Date(dateTime).toLocaleTimeString(),
        city: successValue.name,
        country: successValue.sys.country,
      };
      if (searchHistory) {
        const nextWeatherList = searchHistory.filter(
          (item) => item.key !== search.key,
        );
        setSearchHistory([search, ...nextWeatherList]);
      } else {
        setSearchHistory([search]);
      }
    } else {
      // "remove" retrieved weather
      const failureValue = value as WeatherFailureModel;
      setWeather({ cod: failureValue.cod, message: failureValue.message });
    }
  };

  const removeSearch = (key: string) => {
    const nextWeatherList = searchHistory
      ? searchHistory?.filter((item) => item.key !== key)
      : [];
    setSearchHistory(nextWeatherList);
  };

  const value = useMemo(
    () => ({
      weather,
      setWeather: setFormattedWeather,
      searchHistory,
      removeSearch,
    }),
    [weather, searchHistory],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// ==================
// Context usage
// ==================
export const useDataContext = () =>
  useContext(DataContext) as DataContextInterface;
