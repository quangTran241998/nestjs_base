import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto, ParamsUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import { PaginationResponse, ResponseCommon, ResponseDataListCommon } from 'src/interfaces/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { MailerService } from '../mail/mail.service';
import { ResponseHelper } from '../response-common/responseCommon.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    @Inject(forwardRef(() => AuthService))
    @Inject(forwardRef(() => MailerService))
    private userModel: Model<UserDocument>,
    private authService: AuthService,
    private mailerService: MailerService,
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

  async create(createUserDto: CreateUserDto): Promise<ResponseCommon<{ urlConfirm: string }>> {
    const { email, username } = createUserDto;
    const isCheckUserExit = await this.findOne(username);
    const isCheckEmailExit = await this.findOneEmail(email);

    if (isCheckUserExit.data) {
      throw await this.responseHelper.error(`Tài khoản đã tồn tại`);
    } else if (isCheckEmailExit.data) {
      throw await this.responseHelper.error(`Email đã tồn tại`);
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
        return this.responseHelper.success({ urlConfirm: urlConfirm });
      } catch {
        throw this.responseHelper.error(`Đã có lỗi xảy ra`);
      }
    }
  }

  async findOne(username: string): Promise<ResponseCommon<UserDocument>> {
    try {
      const userDetails = await this.userModel.findOne({ username }).exec();
      return this.responseHelper.success(userDetails);
    } catch {
      throw this.responseHelper.error(`Không tìm thấy username ${username}`);
    }
  }

  async findOneEmail(email: string): Promise<ResponseCommon<User>> {
    try {
      const userDetails = await this.userModel.findOne({ email }).exec();
      return this.responseHelper.success(userDetails);
    } catch {
      throw this.responseHelper.error(`Không tìm thấy email ${email}`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseCommon<User>> {
    const updateAt = new Date();
    const userDetails = await this.userModel
      .findOneAndUpdate({ _id: id }, { ...updateUserDto, updateAt }, { new: true })
      .exec();

    if (!userDetails) {
      throw this.responseHelper.error(`Không tìm thấy id ${id}`);
    }
    return this.responseHelper.success(userDetails);
  }

  async delete(id: string): Promise<ResponseCommon<User>> {
    try {
      const userDetails = await this.userModel.findOneAndDelete({ _id: id }).exec();
      return this.responseHelper.success(userDetails);
    } catch {
      throw this.responseHelper.error(`Không tìm thấy id ${id}`);
    }
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
