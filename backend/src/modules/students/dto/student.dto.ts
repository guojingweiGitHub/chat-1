import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  @IsString()
  @IsIn(['男', '女'], { message: '性别只能为男或女' })
  gender: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthDate?: Date;

  @IsString()
  @IsNotEmpty({ message: '联系电话不能为空' })
  phone: string;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsNumber()
  @Type(() => Number)
  campusId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  classId?: number;

  @Type(() => Date)
  @IsDate()
  enrollmentDate: Date;

  @IsOptional()
  @IsIn(['active', 'suspended', 'graduated', 'dropped'])
  status?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  campusId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  classId?: number;

  @IsOptional()
  @IsIn(['active', 'suspended', 'graduated', 'dropped'])
  status?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class QueryStudentDto {
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
  classId?: number;

  @IsOptional()
  @IsIn(['active', 'suspended', 'graduated', 'dropped'])
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
