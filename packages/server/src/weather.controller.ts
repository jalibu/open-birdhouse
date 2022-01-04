import { Controller, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/api/weather')
  getStats(): any {
    return this.weatherService.getWeather();
  }
}
