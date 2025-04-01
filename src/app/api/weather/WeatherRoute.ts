import { logger } from '@/lib/logger';
import { getWeatherSchema } from '@/modules/Weather/WeatherModel';
import { getCityWeather } from '@/modules/Weather/WeatherService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const get = {
      city: params.get('city') ? params.get('city') : undefined,
      country: params.get('country') ? params.get('country') : undefined,
    };

    const validation = getWeatherSchema.safeParse(get);
    if (!validation.success) {
      logger.error(
        'Validation error in GET /weather route',
        validation.error.errors,
      );

      return new NextResponse('Bad Request', { status: 400 });
    }

    const res = await getCityWeather(validation.data);
    if (res) {
      return NextResponse.json(res);
    }
    return new NextResponse('System Error', { status: 500 });
  } catch (err) {
    logger.error('in GET /weather route', err as any);
    return new NextResponse('System Error', { status: 500 });
  }
}
