// src/users/dto/create-user.dto.ts
import { IsBoolean, IsNumber, IsOptional, IsString, MinLength, IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { ROLE } from 'src/modules/auth/roles/roles.enum';
import { PaginationDto } from './common.dto';
import { Transform } from 'class-transformer';
import { convertParamStringToBoolean } from 'src/common/helpers/common';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(6)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  role: ROLE[];
}

export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsString()
  role?: ROLE;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'refreshToken should not be empty' })
  refreshToken: string;
}

export class ParamsUserDto extends PaginationDto {
  @IsOptional()
  @IsString()
  username: string;
  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive phải là giá trị boolean' })
  @Transform(({ value }) => {
    return convertParamStringToBoolean(value);
  })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;
}
