// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  Query,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from 'src/dtos/user.dto';
import { UsersService } from '../user/user.service';
import { LoggingInterceptor } from 'src/common/interceptor/loggingInterceptor';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('testToken')
  async testToken(@Query('token') token: string) {
    const decode = await this.authService.decodeToken(token);
    return decode;
  }

  @Get('confirm')
  async verifyEmail(@Query('token') token: string) {
    const decode = await this.authService.decodeToken(token);
    const user = await this.usersService.findOneEmail(decode.email);

    if (user) {
      //@ts-ignore
      return this.usersService.update(user.data._id, { isEmailVerified: true, isActive: true });
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refreshToken')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    return this.authService.refreshToken(refreshToken);
  }
}
