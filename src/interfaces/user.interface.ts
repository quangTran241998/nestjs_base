import { Document } from 'mongoose';
import { Role } from 'src/modules/auth/roles/roles.enum';

export interface IUser {
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  roles: Role[];
  createdAt: Date;
  updateAt: Date;
  age: number;
  password?: string;
  _id: string;
}
