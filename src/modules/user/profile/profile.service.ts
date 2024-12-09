import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/dtos/user.dto';
import { ResponseCommon } from 'src/interfaces/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { User } from 'src/schemas/user.schema';
import { UsersService } from '../user.service';

@Injectable()
export class ProfileService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async getProfileUser(token: string): Promise<ResponseCommon<User>> {
    const userDecode = await this.authService.decodeToken(token);
    const userInfo = await this.usersService.findOne(userDecode.username);

    return userInfo;
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<ResponseCommon<User>> {
    return this.usersService.update(id, updateUserDto);
  }
}
