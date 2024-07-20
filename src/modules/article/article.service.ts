import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseType } from '../../constant/type';
import { ServerMessage, ServerStatus } from 'src/constant/enum';
import { CreateArticleDto } from 'src/dto/article.dto';
import { Article } from 'src/interfaces/article.interface';

@Injectable()
export class ArticleService {
  constructor(@InjectModel('Article') private article: Model<Article>) {}

  async findAll(): Promise<ResponseType<Article[]>> {
    try {
      const data = await this.article.find().exec();
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

  async findOne(id: string): Promise<ResponseType<Article>> {
    try {
      const data = await this.article.findOne({ _id: id }).exec();
      return {
        statusCode: ServerStatus.OK,
        message: ServerMessage.OK,
        result: {
          data: data,
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

  async create(CreateArticleDto: CreateArticleDto): Promise<ResponseType<Article>> {
    const createdCat = new this.article({
      ...CreateArticleDto,
    });
    try {
      const data = await createdCat.save();
      return {
        statusCode: ServerStatus.OK,
        message: ServerMessage.OK,
        result: {
          data: data,
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

  async update(id: string, updateCatDto: CreateArticleDto): Promise<ResponseType<Article>> {
    try {
      const data = await this.article.findOneAndUpdate({ _id: id }, updateCatDto, { new: true }).exec();
      return {
        statusCode: ServerStatus.OK,
        message: ServerMessage.OK,
        result: {
          data: data,
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

  async delete(id: string): Promise<ResponseType<Article>> {
    try {
      const data = await this.article.findOneAndDelete({ _id: id }).exec();
      return {
        statusCode: ServerStatus.OK,
        message: ServerMessage.OK,
        result: {
          data: data,
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
}
