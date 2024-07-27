import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from '../user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UsersModule, JwtModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
