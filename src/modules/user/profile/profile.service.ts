import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/dto/user.dto';
import { ResponseCommon } from 'src/interfaces/common';
import { User } from 'src/schemas/user.schema';
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

    const user = this.usersService.findOne(username);

    return user;
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<ResponseCommon<User>> {
    return this.usersService.update(id, updateUserDto);
  }

  async deleteProfile(id: string): Promise<ResponseCommon<User>> {
    return this.usersService.delete(id);
  }
}
