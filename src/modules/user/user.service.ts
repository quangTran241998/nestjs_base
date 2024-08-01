// src/users/users.service.ts
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ServerMessage } from 'src/constant/enum';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { IUser } from 'src/interfaces/user.interface';
import { User } from 'src/schemas/user.schema';
import { ResponseData } from 'src/services/response.service';
import { ResponseType } from '../../constant/type';
import { AuthService } from '../auth/auth.service';
import { MailerService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    @Inject(forwardRef(() => AuthService))
    @Inject(forwardRef(() => MailerService))
    private userModel: Model<IUser>,
    private authService: AuthService,
    private mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ urlConfirm: string }> {
    const { email, username } = createUserDto;
    const isCheckUserExit = await this.findOne(username);
    const isCheckEmailExit = await this.findOneEmail(email);

    if (isCheckUserExit) {
      throw new HttpException('Tài khoản đã tồn tại', HttpStatus.BAD_REQUEST);
    } else if (isCheckEmailExit) {
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

  async findOne(username: string): Promise<IUser> {
    return await this.userModel.findOne({ username }).exec();
  }

  async findOneEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseType<IUser>> {
    const updateAt = new Date();
    const existingCat = await this.userModel
      .findOneAndUpdate({ _id: id }, { ...updateUserDto, updateAt }, { new: true })
      .exec();

    if (!existingCat) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new ResponseData(existingCat, HttpStatus.OK, ServerMessage.OK);
  }

  async delete(id: string): Promise<ResponseType<IUser>> {
    try {
      const deletedUser = await this.userModel.findOneAndDelete({ _id: id }).exec();
      return new ResponseData(deletedUser, HttpStatus.OK, ServerMessage.OK);
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
