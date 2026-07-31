import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto, QueryClassDto } from './dto/class.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async findAll(@Query() query: QueryClassDto) {
    return this.classesService.findAll(query);
  }

  @Get('active')
  async findAllActive() {
    return this.classesService.findAllActive();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Post()
  @Roles('admin', 'campus_manager')
  async create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Put(':id')
  @Roles('admin', 'campus_manager')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClassDto) {
    return this.classesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.remove(id);
  }
}
