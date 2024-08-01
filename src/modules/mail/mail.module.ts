import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [],
  controllers: [],
  providers: [MailerService, UsersService],
  exports: [MailerService],
})
export class MailModule {}
