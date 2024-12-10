import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto, ParamsUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import { PaginationResponse } from 'src/interfaces/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ResponseHelper } from '../response-common/responseCommon.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly responseHelper: ResponseHelper,
  ) {}

  async findAll(filters: ParamsUserDto): Promise<{ users: UserDocument[] } & PaginationResponse> {
    const { page: pageParam, size: sizeParam, ...searchCriteria } = filters;
    const query = this.buildSearchQuery(searchCriteria);

    try {
      const page = pageParam ?? 1;
      const size = sizeParam ?? 10;

      const offset = (page - 1) * size;

      const [data, count] = await Promise.all([
        this.userModel.find(query).skip(offset).limit(size).exec(),
        this.userModel.countDocuments(query).exec(),
      ]);

      return { users: data, total: count, page, size };
    } catch {
      throw this.responseHelper.error(`Đã có lỗi xảy ra`);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, username } = createUserDto;
    const isCheckUserExit = await this.findOneByUsername(username);
    const isCheckEmailExit = await this.findOneEmail(email);

    if (isCheckUserExit) {
      throw await this.responseHelper.error(`Tài khoản đã tồn tại`);
    } else if (isCheckEmailExit) {
      throw await this.responseHelper.error(`Email đã tồn tại`);
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const createUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const user = await createUser.save();
      return user;
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    const userDetails = await this.userModel.findOne({ _id: id }).exec();
    return userDetails;
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    const userDetails = await this.userModel.findOne({ username }).exec();
    return userDetails;
  }

  async findOneEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const updateAt = new Date();
    const user = await this.userModel
      .findOneAndUpdate({ _id: id }, { ...updateUserDto, updateAt }, { new: true })
      .exec();

    return user;
  }

  async delete(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOneAndDelete({ _id: id }).exec();
    return user;
  }

  //search params
  private buildSearchQuery(searchCriteria: Partial<ParamsUserDto>) {
    const query: any = {};
    if (searchCriteria.username) {
      query.username = { $regex: searchCriteria.username, $options: 'i' };
    }

    if (typeof searchCriteria.isActive === 'boolean') {
      query.isActive = searchCriteria.isActive;
    }

    return query;
  }
}
