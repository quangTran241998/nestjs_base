import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/modules/auth/roles/roles.enum';

// Decorator for Auth
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Decorator for permission
export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);
