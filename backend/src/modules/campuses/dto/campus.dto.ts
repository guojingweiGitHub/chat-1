import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateCampusDto {
  @IsString()
  @IsNotEmpty({ message: '校区名称不能为空' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '地址不能为空' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: '联系电话不能为空' })
  phone: string;

  @IsOptional()
  @IsNumber()
  managerId?: number;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}

export class UpdateCampusDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  managerId?: number;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}

export class QueryCampusDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  pageSize?: number;
}
