// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/constant/common';
import { ResponseCommonModule } from '../response-common/responseCommon.module';
import { UsersModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles/roles.guard';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ProfileModule),

    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    ResponseCommonModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
