import { Injectable } from '@nestjs/common';

import * as OpenWeatherAPI from 'openweather-api-node';

@Injectable()
export class WeatherService {
  private weatherClient;
  constructor() {
    this.weatherClient = new OpenWeatherAPI({
      key: process.env.WEATHER_API_KEY,
      locationName: process.env.WEATHER_LOCATION,
      units: process.env.WEATHER_UNITS,
    });
  }
  async getWeather(): Promise<any> {
    const weatherData = await this.weatherClient.getCurrent();

    return weatherData;
  }
}
