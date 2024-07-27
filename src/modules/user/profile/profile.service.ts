import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseType } from 'src/constant/type';
import { UpdateUserDto } from 'src/dto/user.dto';
import { IUser } from 'src/interfaces/user.interface';
import { UsersService } from '../user.service';

@Injectable()
export class ProfileService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getProfileUser(token: string) {
    const decode = await this.jwtService.decode(token);
    const username = decode.username;
    console.log(token, decode, username);

    const user = this.usersService.findOne(username);

    return user;
  }

  async updateProfile(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseType<IUser>> {
    return this.usersService.update(id, updateUserDto);
  }

  async deleteProfile(id: string): Promise<ResponseType<IUser>> {
    return this.usersService.delete(id);
  }
}
