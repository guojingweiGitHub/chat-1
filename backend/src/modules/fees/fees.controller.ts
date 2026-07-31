import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FeesService } from './fees.service';
import {
  CreateFeeCycleDto, UpdateFeeCycleDto, QueryFeeCycleDto,
  CreatePaymentDto, UpdatePaymentDto, QueryPaymentDto,
} from './dto/fee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('fees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  // ===== 收费周期 =====
  @Get('cycles')
  async findAllCycles(@Query() query: QueryFeeCycleDto) {
    return this.feesService.findAllCycles(query);
  }

  @Get('cycles/:id')
  async findOneCycle(@Param('id', ParseIntPipe) id: number) {
    return this.feesService.findOneCycle(id);
  }

  @Post('cycles')
  @Roles('admin', 'campus_manager')
  async createCycle(@Body() dto: CreateFeeCycleDto) {
    return this.feesService.createCycle(dto);
  }

  @Put('cycles/:id')
  @Roles('admin', 'campus_manager')
  async updateCycle(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFeeCycleDto) {
    return this.feesService.updateCycle(id, dto);
  }

  @Delete('cycles/:id')
  @Roles('admin')
  async removeCycle(@Param('id', ParseIntPipe) id: number) {
    return this.feesService.removeCycle(id);
  }

  // ===== 缴费记录 =====
  @Get('payments')
  async findAllPayments(@Query() query: QueryPaymentDto) {
    return this.feesService.findAllPayments(query);
  }

  @Get('payments/expiring')
  async getExpiringPayments(@Query('days') days?: number) {
    return this.feesService.getExpiringPayments(days || 30);
  }

  @Get('payments/overdue')
  async getOverduePayments() {
    return this.feesService.getOverduePayments();
  }

  @Get('payments/:id')
  async findOnePayment(@Param('id', ParseIntPipe) id: number) {
    return this.feesService.findOnePayment(id);
  }

  @Post('payments')
  @Roles('admin', 'campus_manager', 'receptionist')
  async createPayment(@Body() dto: CreatePaymentDto, @CurrentUser('id') userId: number) {
    return this.feesService.createPayment(dto, userId);
  }

  @Put('payments/:id')
  @Roles('admin', 'campus_manager', 'receptionist')
  async updatePayment(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
    return this.feesService.updatePayment(id, dto);
  }

  @Delete('payments/:id')
  @Roles('admin')
  async removePayment(@Param('id', ParseIntPipe) id: number) {
    return this.feesService.removePayment(id);
  }
}
