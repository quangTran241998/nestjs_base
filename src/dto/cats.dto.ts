export class CreateCatDto {
  name: string;
  color: string;
  id?: number;
}

export class ListAllEntities {
  limit: string;
}

export class UpdateCatDto {
  name: string;
  color: string;
  id: number;
}
