import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto, ParamsCats, UpdateCatDto } from 'src/dto/cats.dto';
import { ResponseCommon, ResponseDataListCommon } from 'src/interfaces/common';
import { Cat, CatDocument } from 'src/schemas/cats.schema';
import { ResponseHelper } from '../response-common/responseCommon.service';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name)
    private catModel: Model<CatDocument>,
    private readonly responseHelper: ResponseHelper,
  ) {}

  async findAll(filters: ParamsCats, userId: string): Promise<ResponseCommon<ResponseDataListCommon<Cat[]>>> {
    const { page: pageParam, size: sizeParam, ...searchCriteria } = filters;
    const query = this.buildSearchQuery(searchCriteria);

    query['userId'] = userId;

    try {
      const page = pageParam ?? 1;
      const size = sizeParam ?? 10;

      const offset = (page - 1) * size;

      const [data, count] = await Promise.all([
        this.catModel.find(query).skip(offset).limit(size).exec(),
        this.catModel.countDocuments(query).exec(),
      ]);
      return this.responseHelper.success({
        data: data,
        page: page,
        size: size,
        total: count,
      });
    } catch {
      throw this.responseHelper.error(`Đã có lỗi xảy ra`);
    }
  }

  async findOne(id: string): Promise<ResponseCommon<Cat>> {
    const catDetails = await this.catModel.findOne({ _id: id }).exec();
    if (!catDetails) {
      throw this.responseHelper.error(`Không tìm thấy id ${id}`);
    }
    return this.responseHelper.success(catDetails);
  }

  async create(createCatDto: CreateCatDto, userId: string): Promise<ResponseCommon<Cat>> {
    try {
      const createdCat = new this.catModel({ ...createCatDto, userId: userId });
      await createdCat.save();
      return this.responseHelper.success(createdCat);
    } catch {
      throw this.responseHelper.error(`Đã có lỗi xảy ra`);
    }
  }

  async update(id: string, updateCatDto: UpdateCatDto): Promise<ResponseCommon<Cat>> {
    try {
      const catUpdate = await this.catModel.findOneAndUpdate({ _id: id }, updateCatDto, { new: true }).exec();

      return this.responseHelper.success(catUpdate);
    } catch {
      throw this.responseHelper.error(`Không tìm thấy id ${id}`);
    }
  }

  async delete(id: string): Promise<ResponseCommon<Cat>> {
    try {
      const catDelete = await this.catModel.findOneAndDelete({ _id: id }).exec();

      return this.responseHelper.success(catDelete);
    } catch {
      throw this.responseHelper.error(`Không tìm thấy id ${id}`);
    }
  }

  //search params
  private buildSearchQuery(searchCriteria: Partial<ParamsCats>) {
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
