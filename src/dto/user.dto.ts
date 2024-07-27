// src/users/dto/create-user.dto.ts
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/modules/auth/roles/roles.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  roles: Role[];
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
  phoneNumber: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
