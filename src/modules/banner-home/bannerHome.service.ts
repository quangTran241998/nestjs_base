import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto } from 'src/dto/cats.dto';
import { BannerHome } from 'src/interfaces/bannerHome.interface';
import { ResponseType } from '../../constant/type';
import { ServerMessage, ServerStatus } from 'src/constant/enum';

@Injectable()
export class BannerHomeService {
  constructor(
    @InjectModel('Banner home') private bannerHome: Model<BannerHome>,
  ) {}

  async findAll(): Promise<ResponseType<BannerHome[]>> {
    try {
      const data = await this.bannerHome.find().exec();
      return {
        statusCode: ServerStatus.OK,
        message: ServerMessage.OK,
        result: {
          data: data,
          total: data.length,
        },
      };
    } catch {
      return {
        statusCode: ServerStatus.ERROR,
        message: ServerMessage.ERROR,
        result: {},
      };
    }
  }

  async findOne(id: string): Promise<BannerHome> {
    const cat = await this.bannerHome.findOne({ _id: id }).exec();
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return cat;
  }

  async create(createCatDto: CreateCatDto): Promise<BannerHome> {
    const createdCat = new this.bannerHome({
      ...createCatDto,
    });
    return createdCat.save();
  }

  async update(id: string, updateCatDto: CreateCatDto): Promise<BannerHome> {
    const existingCat = await this.bannerHome
      .findOneAndUpdate({ _id: id }, updateCatDto, { new: true })
      .exec();
    if (!existingCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return existingCat;
  }

  async delete(id: string): Promise<BannerHome> {
    const deletedCat = await this.bannerHome
      .findOneAndDelete({ _id: id })
      .exec();
    if (!deletedCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    //
    return deletedCat;
  }
}
