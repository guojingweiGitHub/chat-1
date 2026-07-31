import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CampusesService } from './campuses.service';
import { CreateCampusDto, UpdateCampusDto, QueryCampusDto } from './dto/campus.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';

@Controller('campuses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CampusesController {
  constructor(private readonly campusesService: CampusesService) {}

  @Get()
  async findAll(@Query() query: QueryCampusDto) {
    return this.campusesService.findAll(query);
  }

  @Get('active')
  async findAllActive() {
    return this.campusesService.findAllActive();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.campusesService.findOne(id);
  }

  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateCampusDto) {
    return this.campusesService.create(dto);
  }

  @Put(':id')
  @Roles('admin', 'campus_manager')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCampusDto) {
    return this.campusesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.campusesService.remove(id);
  }
}
