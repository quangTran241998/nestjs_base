import { Module } from '@nestjs/common';
import { UsersModule } from '../user/user.module';
import { UsersService } from '../user/user.service';
import { MailerService } from './mail.service';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [MailerService, UsersService],
  exports: [MailerService],
})
export class MailModule {}
