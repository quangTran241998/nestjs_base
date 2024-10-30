import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from './common.dto';

export class CreateCatDto {
  @IsString()
  name: string;
  @IsString()
  color: string;
}

export class UpdateCatDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  color: string;
}

export class ParamsCats extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  color?: string;
}
