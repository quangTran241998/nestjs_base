import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from './common.dto';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  fullname?: string;
  @IsOptional()
  @IsString()
  email: string;
  @IsOptional()
  @IsString()
  phoneNumber?: string;
  @IsOptional()
  @IsString()
  address?: string;
  @IsOptional()
  @IsString()
  age?: number;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullname: string;
  @IsOptional()
  @IsString()
  email: string;
  @IsOptional()
  @IsString()
  phoneNumber: string;
  @IsOptional()
  @IsString()
  address: string;
  @IsOptional()
  @IsString()
  age: number;
}

export class QueryProfiles extends PaginationDto {
  @IsOptional()
  @IsString()
  fullname: string;
}
