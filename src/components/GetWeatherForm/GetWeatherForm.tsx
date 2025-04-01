'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { logger } from '@/lib/logger';
import {
  GetWeatherValues,
  WeatherFailureModel,
  WeatherSuccessModel,
  getWeatherSchema,
} from '@/modules/Weather/WeatherModel';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

interface GetWeatherFormProps {
  setWeather: (value: WeatherSuccessModel | WeatherFailureModel | null) => void;
}
const GetWeatherForm: React.FC<GetWeatherFormProps> = (props) => {
  const { setWeather } = props;
  const form = useForm<GetWeatherValues>({
    resolver: zodResolver(getWeatherSchema),
    defaultValues: { city: '', country: '' },
  });

  const onSubmit = async (values: GetWeatherValues) => {
    const response = await fetch(
      `/api/weather?city=${values.city}&country=${values.country}`,
      {
        method: 'GET',
      },
    ).catch((err) => {
      logger.error('error in create inventory', err);
    });

    if (response?.ok) {
      const data = await response.json();
      setWeather(data);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[1280px] flex flex-col gap-8 sm:flex-row sm:items-center"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <FormLabel>City: </FormLabel>
                  <FormControl>
                    <Input className="h-8 !mt-0" type="text" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <FormLabel>Country: </FormLabel>
                  <FormControl>
                    <Input className="h-8 !mt-0" type="text" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" type="submit">
            Search
          </Button>
          <Button size="sm" variant="ghost" onClick={() => form.reset()}>
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GetWeatherForm;
