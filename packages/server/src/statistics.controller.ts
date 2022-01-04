import { Controller, Get, Request } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/api/statistics')
  getStats(@Request() request): any {
    return this.statisticsService.getStatistics(request.headers);
  }
}
