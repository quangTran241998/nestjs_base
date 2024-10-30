import { ROLE } from 'src/modules/auth/roles/roles.enum';

export interface IUser {
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  role: ROLE[];
  createdAt: Date;
  updateAt: Date;
  age: number;
  password?: string;
  _id: string;
  isEmailVerified: boolean;
}
