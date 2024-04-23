import { Injectable } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from 'src/dto/cats.dto';
import { Cat } from 'src/interfaces/ICat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [
    { id: 1, name: '1', color: 'white' },
    { id: 2, name: '2', color: 'black' },
  ];

  create(cat: CreateCatDto) {
    const id = this.cats.length + 1;
    this.cats.push({ ...cat, id: id });
    return { ...cat, id: id };
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findOne(id: number) {
    return this.cats.find((item) => item.id === id);
  }

  update(cat: UpdateCatDto) {
    const index = this.cats.findIndex((item) => item.id === cat.id);
    this.cats[index] = cat;
    return this.cats[index];
  }

  delete(id: number) {
    const index = this.cats.findIndex((item) => item.id === id);

    this.cats.splice(index, 1);

    return `xoá thành công id ${id}`;
  }
}
