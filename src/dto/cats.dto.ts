import { PaginationDto } from './common.dto';

export class CreateCatDto {
  name: string;
  color: string;
}

export class UpdateCatDto {
  name: string;
  color: string;
}

export class GetCatsDto extends PaginationDto {
  name?: string;
  color?: string;
}
