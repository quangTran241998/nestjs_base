import { IsString, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  page: number;
  @IsOptional()
  @IsString()
  size: number;
}
