import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, IsIn, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

// 收费周期 DTO
export class CreateFeeCycleDto {
  @IsString()
  @IsNotEmpty({ message: '周期名称不能为空' })
  name: string;

  @IsString()
  @IsIn(['semester', 'year', 'month', 'summer', 'winter', 'custom'], { message: '周期类型无效' })
  type: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsNumber()
  @Type(() => Number)
  standardFee: number;

  @IsNumber()
  @Type(() => Number)
  campusId: number;
}

export class UpdateFeeCycleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  standardFee?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  campusId?: number;
}

export class QueryFeeCycleDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  campusId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;
}

// 缴费记录 DTO
export class CreatePaymentDto {
  @IsNumber()
  @Type(() => Number)
  studentId: number;

  @IsNumber()
  @Type(() => Number)
  cycleId: number;

  @IsNumber()
  @Type(() => Number)
  campusId: number;

  @IsNumber()
  @Type(() => Number)
  amountDue: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amountPaid?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountRate?: number;

  @IsOptional()
  @IsString()
  discountReason?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paymentDate?: Date;

  @IsOptional()
  @IsString()
  @IsIn(['cash', 'transfer', 'pos', 'wechat', 'alipay'])
  paymentMethod?: string;

  @IsOptional()
  @IsIn(['paid', 'partial', 'unpaid', 'refunded'])
  status?: string;

  @Type(() => Date)
  @IsDate()
  dueDate: Date;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amountPaid?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountRate?: number;

  @IsOptional()
  @IsString()
  discountReason?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paymentDate?: Date;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsIn(['paid', 'partial', 'unpaid', 'refunded'])
  status?: string;
}

export class QueryPaymentDto {
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
  cycleId?: number;

  @IsOptional()
  @IsIn(['paid', 'partial', 'unpaid', 'refunded'])
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
