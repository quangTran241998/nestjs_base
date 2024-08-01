import { Role } from 'src/modules/auth/roles/roles.enum';

export type ResponseType<D> = {
  statusCode: number;
  message: string;
  result: {
    data?: D | D[] | {};
    total?: number;
  };
};

export type MetaParams = {
  search: string;
  page: string;
};

export type PayloadToken = {
  username: string;
  id: string;
  roles: Role[];
  isActive: boolean;
  isEmailVerified: boolean;
  email: string;
};
