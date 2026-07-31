import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.statisticsService.getDashboardStats();
  }

  @Get('students')
  async getStudentStats() {
    return this.statisticsService.getStudentStats();
  }

  @Get('payments')
  async getPaymentStats() {
    return this.statisticsService.getPaymentStats();
  }

  @Get('campus-comparison')
  async getCampusComparison() {
    return this.statisticsService.getCampusComparison();
  }
}
