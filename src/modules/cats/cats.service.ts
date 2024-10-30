import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto, ParamsCats, UpdateCatDto } from 'src/dto/cats.dto';
import { ResponseCommon, ResponseDataListCommon } from 'src/interfaces/common';
import { ResponseHelper } from 'src/services/response.service';
import { Cat, CatDocument } from 'src/schemas/cats.schema';

@Injectable()
export class CatsService {
  constructor(@InjectModel('Cat') private catModel: Model<CatDocument>) {}

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
      return ResponseHelper.success({
        data: data,
        page: page,
        size: size,
        total: count,
      });
    } catch {
      throw ResponseHelper.error(`Đã có lỗi xảy ra`);
    }
  }

  async findOne(id: string): Promise<ResponseCommon<Cat>> {
    const catDetails = await this.catModel.findOne({ _id: id }).exec();
    if (!catDetails) {
      throw ResponseHelper.error(`Không tìm thấy id ${id}`);
    }
    return ResponseHelper.success(catDetails);
  }

  async create(createCatDto: CreateCatDto, userId: string): Promise<ResponseCommon<Cat>> {
    try {
      const createdCat = new this.catModel({ ...createCatDto, userId: userId });
      await createdCat.save();
      return ResponseHelper.success(createdCat);
    } catch {
      throw ResponseHelper.error(`Đã có lỗi xảy ra`);
    }
  }

  async update(id: string, updateCatDto: UpdateCatDto): Promise<ResponseCommon<Cat>> {
    try {
      const catUpdate = await this.catModel.findOneAndUpdate({ _id: id }, updateCatDto, { new: true }).exec();

      return ResponseHelper.success(catUpdate);
    } catch {
      throw ResponseHelper.error(`Không tìm thấy id ${id}`);
    }
  }

  async delete(id: string): Promise<ResponseCommon<Cat>> {
    try {
      const catDelete = await this.catModel.findOneAndDelete({ _id: id }).exec();

      return ResponseHelper.success(catDelete);
    } catch {
      throw ResponseHelper.error(`Không tìm thấy id ${id}`);
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
