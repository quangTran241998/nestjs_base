import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { MailerService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { UsersController } from './user.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => AuthModule)],
  providers: [UsersService, MailerService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
