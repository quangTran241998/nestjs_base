import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { MailerService } from '../mail/mail.service';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => AuthModule)],
  providers: [UsersService, MailerService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
