import {
  HttpStatus,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServerMessage, ServerStatus } from 'src/constant/enum';
import { CreateCatDto, GetCatsDto, UpdateCatDto } from 'src/dto/cats.dto';
import { Cat } from 'src/interfaces/cat.interface';
import { v4 as uuidv4 } from 'uuid';
import { ResponseType } from '../../constant/type';
import { ResponseData } from 'src/services/response.service';

@Injectable()
export class CatsService {
  constructor(@InjectModel('Cat') private catModel: Model<Cat>) {}

  async findAll(filters: GetCatsDto): Promise<ResponseType<Cat[]>> {
    const { page: pageParam, size, ...searchCriteria } = filters;
    const query = this.buildSearchQuery(searchCriteria);
    try {
      const page = pageParam ?? 1;
      const limit = size ?? 1000;

      const offset = (page - 1) * limit;

      const [data, count] = await Promise.all([
        this.catModel.find(query).skip(offset).limit(limit).exec(),
        this.catModel.countDocuments(query).exec(),
      ]);

      return new ResponseData(data, ServerStatus.OK, ServerMessage.OK, count);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<Cat> {
    const cat = await this.catModel.findOne({ _id: id }).exec();
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return cat;
  }

  async create(createCatDto: CreateCatDto): Promise<ResponseType<Cat>> {
    const createdCat = new this.catModel({ catId: uuidv4(), ...createCatDto });
    return new ResponseData(
      createdCat.save(),
      ServerStatus.OK,
      ServerMessage.OK,
    );
  }

  async update(
    id: string,
    updateCatDto: UpdateCatDto,
  ): Promise<ResponseType<Cat>> {
    try {
      const existingCat = await this.catModel
        .findOneAndUpdate({ _id: id }, updateCatDto, { new: true })
        .exec();

      return new ResponseData(existingCat, ServerStatus.OK, ServerMessage.OK);
    } catch {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<ResponseType<Cat>> {
    try {
      const deletedCat = await this.catModel
        .findOneAndDelete({ _id: id })
        .exec();

      return new ResponseData(deletedCat, ServerStatus.OK, ServerMessage.OK);
    } catch {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
  }

  private buildSearchQuery(searchCriteria: Partial<GetCatsDto>) {
    const query: any = {};
    if (searchCriteria.name) {
      query.name = { $regex: searchCriteria.name, $options: 'i' }; // case-insensitive search
    }
    if (searchCriteria.color) {
      query.description = { $regex: searchCriteria.color, $options: 'i' }; // case-insensitive search
    }
    return query;
  }
}
