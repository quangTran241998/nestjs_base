import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PROVIDES_KEY } from 'src/constant/enum';
import { CreateCatDto, QueryCats, UpdateCatDto } from 'src/dtos/cat.dto';
import { PaginationResponse, ResponseCommon } from 'src/interfaces/common';
import { Cat, CatDocument } from 'src/schemas/cats.schema';
import { ResponseHelper } from '../response-common/responseCommon.service';

@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat.name)
    private catModel: Model<CatDocument>,
    private readonly responseHelper: ResponseHelper,
    @Inject(PROVIDES_KEY.TEST) private readonly config: { appName: string; version: string },
  ) {}

  async findAll(filters: QueryCats): Promise<{ cats: CatDocument[] } & PaginationResponse> {
    const { page: pageQuery, size: sizeQuery, ...searchCriteria } = filters;
    const query = this.buildSearchQuery(searchCriteria);

    const page = pageQuery ?? 1;
    const size = sizeQuery ?? 10;

    const offset = (page - 1) * size;

    const [data, count] = await Promise.all([
      this.catModel.find(query).skip(offset).limit(size).exec(),
      this.catModel.countDocuments(query).exec(),
    ]);

    return { cats: data, total: count, page, size };
  }

  async findOne(id: string): Promise<CatDocument> {
    const cat = await this.catModel.findOne({ _id: id }).exec();
    return cat;
  }

  async create(createCatDto: CreateCatDto, userId: string): Promise<CatDocument> {
    const cat = new this.catModel({ ...createCatDto, userId: userId });
    await cat.save();
    return cat;
  }

  async update(id: string, updateCatDto: UpdateCatDto): Promise<CatDocument> {
    const cat = await this.catModel.findOneAndUpdate({ _id: id }, updateCatDto, { new: true }).exec();
    return cat;
  }

  async delete(id: string): Promise<CatDocument> {
    const cat = await this.catModel.findOneAndDelete({ _id: id }).exec();
    return cat;
  }

  //search params
  private buildSearchQuery(searchCriteria: Partial<QueryCats>) {
    const query: any = {};
    if (searchCriteria.name) {
      query.name = { $regex: searchCriteria.name, $options: 'i' };
    }
    if (searchCriteria.color) {
      query.color = { $regex: searchCriteria.color, $options: 'i' };
    }
    return query;
  }
}
