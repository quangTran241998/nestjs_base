// src/users/users.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseType<User>> {
    const isCheckUserExit = await this.findOne(createUserDto.username);
    if (isCheckUserExit) {
      throw new HttpException('Tài khoản đã tồn tại', HttpStatus.BAD_REQUEST);
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      return new ResponseData(
        await createdUser.save(),
        HttpStatus.OK,
        ServerMessage.OK,
      );
    }
  }

  async findOne(username: string): Promise<IUser> {
    return await this.userModel.findOne({ username }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseType<IUser>> {
    const updateAt = new Date();
    const existingCat = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateUserDto, updateAt },
        { new: true },
      )
      .exec();

    if (!existingCat) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new ResponseData(existingCat, HttpStatus.OK, ServerMessage.OK);
  }

  async delete(id: string): Promise<ResponseType<IUser>> {
    try {
      const deletedUser = await this.userModel
        .findOneAndDelete({ _id: id })
        .exec();
      console.log(deletedUser);

      return new ResponseData(deletedUser, HttpStatus.OK, ServerMessage.OK);
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
