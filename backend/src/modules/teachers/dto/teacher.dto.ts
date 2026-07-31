import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;

  @IsNumber()
  @Type(() => Number)
  campusId: number;

  @IsOptional()
  @IsString()
  subjects?: string;

  @Type(() => Date)
  @IsDate()
  hireDate: Date;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  campusId?: number;

  @IsOptional()
  @IsString()
  subjects?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hireDate?: Date;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}

export class QueryTeacherDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  campusId?: number;

  @IsOptional()
  @IsIn(['active', 'inactive'])
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
