import { z } from 'zod';

export const getWeatherSchema = z.object({
  city: z.string().min(2, {
    message: 'City must be at least 2 characters.',
  }),
  country: z
    .string()
    .length(2, {
      message: 'Country code must be 2 characters.',
    })
    .optional()
    .or(z.literal('')),
});
export type GetWeatherValues = z.infer<typeof getWeatherSchema>;

export type WeatherSuccessModel = {
  cod: number;
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
};

export type WeatherFailureModel = {
  cod: number;
  message: string;
};

export type WeatherDisplayModel = {
  cod: number;
  name?: string;
  main?: string;
  description?: string;
  temperature?: string;
  humidity?: string;
  time?: string;
  message?: string;
};
