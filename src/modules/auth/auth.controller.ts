// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/common/interceptor/loggingInterceptor';
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from 'src/dtos/user.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { UsersService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ProfileService } from '../profile/profile.service';
import { MailerService } from '../mail/mail.service';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private profileService: ProfileService,
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
      return this.usersService.update(user._id, { isEmailVerified: true, isActive: true });
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.usersService.create(createUserDto);
    await this.profileService.create({ email: user.email }, user._id);
    // const token = this.authService.generateToken({ email: user.email });
    // const urlConfirm = await this.mailerService.sendVerificationEmail(user.email, token);
    return user;
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
