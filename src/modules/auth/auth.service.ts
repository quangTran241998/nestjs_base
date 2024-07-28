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
    const user = await this.validateUser(loginUserDto.username, loginUserDto.password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      username: user.username,
      id: user._id,
      roles: user.roles,
      isActive: user?.isActive,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decode = await this.jwtService.verify(refreshToken);
      const payload = {
        username: decode.username,
        id: decode._id,
        roles: decode.roles,
        isActive: decode?.isActive,
      };
      if (payload) {
        const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

        return {
          accessToken,
          refreshToken,
        };
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
