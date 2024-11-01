// src/users/users.service.ts
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto, ParamsUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { ResponseCommon, ResponseDataListCommon } from 'src/interfaces/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ResponseHelper } from 'src/services/response.service';
import { AuthService } from '../auth/auth.service';
import { MailerService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    @Inject(forwardRef(() => AuthService))
    @Inject(forwardRef(() => MailerService))
    private userModel: Model<UserDocument>,
    private authService: AuthService,
    private mailerService: MailerService,
  ) {}

  async findAll(filters: ParamsUserDto): Promise<ResponseCommon<ResponseDataListCommon<User[]>>> {
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

  async create(createUserDto: CreateUserDto): Promise<{ urlConfirm: string }> {
    const { email, username } = createUserDto;
    const isCheckUserExit = await this.findOne(username);
    const isCheckEmailExit = await this.findOneEmail(email);

    if (isCheckUserExit.data) {
      throw new HttpException('Tài khoản đã tồn tại', HttpStatus.BAD_REQUEST);
    } else if (isCheckEmailExit.data) {
      throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const createUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const token = this.authService.generateToken({ email: email });
      try {
        const urlConfirm = await this.mailerService.sendVerificationEmail(email, token);
        createUser.save();
        return { urlConfirm: urlConfirm };
      } catch {
        throw new InternalServerErrorException('Error sent mail');
      }
    }
  }

  async findOne(username: string): Promise<ResponseCommon<User>> {
    try {
      const userDetails = await this.userModel.findOne({ username }).exec();
      return ResponseHelper.success(userDetails);
    } catch {
      throw ResponseHelper.error(`Không tìm thấy user name ${username}`);
    }
  }

  async findOneEmail(email: string): Promise<ResponseCommon<User>> {
    try {
      const userDetails = await this.userModel.findOne({ email }).exec();
      return ResponseHelper.success(userDetails);
    } catch {
      throw ResponseHelper.error(`Không tìm thấy email ${email}`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseCommon<User>> {
    const updateAt = new Date();
    const userDetails = await this.userModel
      .findOneAndUpdate({ _id: id }, { ...updateUserDto, updateAt }, { new: true })
      .exec();

    if (!userDetails) {
      throw ResponseHelper.error(`Không tìm thấy id ${id}`);
    }
    return ResponseHelper.success(userDetails);
  }

  async delete(id: string): Promise<ResponseCommon<User>> {
    try {
      const userDetails = await this.userModel.findOneAndDelete({ _id: id }).exec();
      return ResponseHelper.success(userDetails);
    } catch {
      throw ResponseHelper.error(`Không tìm thấy id ${id}`);
    }
  }

  //search params
  private buildSearchQuery(searchCriteria: Partial<ParamsUserDto>) {
    const query: any = {};
    if (searchCriteria.username) {
      query.username = { $regex: searchCriteria.username, $options: 'i' };
    }
    console.log(searchCriteria.isActive);

    if (typeof searchCriteria.isActive === 'boolean') {
      query.isActive = searchCriteria.isActive; // Gán trực tiếp boolean true/false
    }

    return query;
  }
}
