import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty({ message: '班级名称不能为空' })
  name: string;

  @IsNumber()
  @Type(() => Number)
  campusId: number;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  teacherId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  capacity?: number;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsIn(['active', 'inactive', 'finished'])
  status?: string;
}

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  campusId?: number;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  teacherId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  capacity?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsIn(['active', 'inactive', 'finished'])
  status?: string;
}

export class QueryClassDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  campusId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  teacherId?: number;

  @IsOptional()
  @IsIn(['active', 'inactive', 'finished'])
  status?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;
}
