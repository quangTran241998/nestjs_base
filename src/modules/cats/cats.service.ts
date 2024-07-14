import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto } from 'src/dto/cats.dto';
import { Cat } from 'src/interfaces/cat.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CatsService {
  constructor(@InjectModel('Cat') private catModel: Model<Cat>) {}

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async findOne(id: string): Promise<Cat> {
    const cat = await this.catModel.findOne({ _id: id }).exec();
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return cat;
  }

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel({ catId: uuidv4(), ...createCatDto });
    return createdCat.save();
  }

  async update(id: string, updateCatDto: CreateCatDto): Promise<Cat> {
    const existingCat = await this.catModel
      .findOneAndUpdate({ _id: id }, updateCatDto, { new: true })
      .exec();
    if (!existingCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return existingCat;
  }

  async delete(id: string): Promise<Cat> {
    const deletedCat = await this.catModel.findOneAndDelete({ _id: id }).exec();
    if (!deletedCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    //
    return deletedCat;
  }
}
