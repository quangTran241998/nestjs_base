// src/auth/roles/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';
import { jwtConstants } from 'src/constant/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      console.log(decoded);

      const userRoles = decoded.roles;
      console.log(userRoles);

      return requiredRoles.some((role) => userRoles.includes(role));
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
