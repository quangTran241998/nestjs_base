// src/users/dto/create-user.dto.ts
import { IsOptional, IsString, MinLength } from 'class-validator';
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
