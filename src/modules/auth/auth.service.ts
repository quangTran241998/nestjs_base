// src/auth/auth.service.ts
import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/constant/common';
import { PayloadToken } from 'src/constant/type';
import { LoginUserDto } from 'src/dto/user.dto';
import { IUser } from 'src/interfaces/user.interface';
import { UsersService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const user = await this.usersService.findOne(username);
    if (!user.data) {
      throw new UnauthorizedException('You not verify email');
    }

    if (!user.data.isActive) {
      throw new UnauthorizedException('Account is locked');
    }

    if (user.data && (await bcrypt.compare(password, user.data.password))) {
      //@ts-ignore
      const { password, ...result } = user.data.toObject();
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
      id: user._id,
      username: user.username,
      role: user.role,
      isActive: user?.isActive,
      isEmailVerified: user.isEmailVerified,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: '30d' });

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
        role: decode.role,
        isActive: decode?.isActive,
        isEmailVerified: decode.isEmailVerified,
        email: decode.email,
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

  generateToken(payload: any, expiresIn?: string) {
    return this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: expiresIn ?? '30m' });
  }

  decodeToken(token: string): Promise<PayloadToken> {
    return this.jwtService.verify(token, { secret: jwtConstants.secret });
  }

  tests() {
    return 'test';
  }
}
