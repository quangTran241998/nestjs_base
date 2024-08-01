// src/auth/auth.service.ts
import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { LoginUserDto } from 'src/dto/user.dto';
import { IUser } from 'src/interfaces/user.interface';
import { PayloadToken } from 'src/constant/type';
import { jwtConstants } from 'src/constant/common';
import { MailerService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const user: IUser = await this.usersService.findOne(username);

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('You not verify email');
    }

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
        roles: decode.roles,
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

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  verifyToken(token: string): Promise<PayloadToken> {
    return this.jwtService.verify(token, { secret: jwtConstants.secret });
  }

  tests() {
    return 'test';
  }
}
