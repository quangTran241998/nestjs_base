// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { LoginUserDto } from 'src/dto/user.dto';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const user: IUser = await this.usersService.findOne(username);

    if (!user.isActive) {
      throw new UnauthorizedException('Account is locked');
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      //@ts-ignore
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      username: user.username,
      sub: user._id,
      roles: user.roles,
      isActive: user?.isActive,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
