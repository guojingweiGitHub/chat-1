import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ImportDataDto {
  @IsArray()
  data: any[];

  @IsString()
  type: string; // 'students', 'teachers', 'payments'

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  campusId?: number;
}

export class FieldMappingDto {
  @IsArray()
  mappings: { source: string; target: string }[];
}
