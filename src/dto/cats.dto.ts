import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from './common.dto';

export class CreateCatDto {
  name: string;
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

export class GetCatsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  color?: string;
}
