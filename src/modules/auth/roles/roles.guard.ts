import { AuthService } from 'src/modules/auth/auth.service';
// src/auth/roles/roles.guard.ts
import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ResponseHelper } from 'src/modules/response-common/responseCommon.service';
import { ROLES_KEY } from './roles.decorator';
import { ROLE } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw await this.responseHelper.error('test.response.notToken', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = await this.authService.decodeToken(token);
      const userRoles = decoded.role;
      const isPermisson = requiredRoles.some((role) => userRoles.includes(role));
      if (isPermisson) {
        return isPermisson;
      } else {
        throw await this.responseHelper.error('test.response.notPermisson', HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      throw error;
    }
  }
}
