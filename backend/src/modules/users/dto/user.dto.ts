import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEmail, MinLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少6位' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  realName: string;

  @IsString()
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsNumber()
  campusId?: number;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  realName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsNumber()
  campusId?: number;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: '新密码不能为空' })
  @MinLength(6, { message: '密码至少6位' })
  newPassword: string;
}

export class QueryUserDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsNumber()
  campusId?: number;

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
