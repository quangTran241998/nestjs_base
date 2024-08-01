import { Role } from './../modules/auth/roles/roles.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: [Role.User, Role.Admin], default: Role.User })
  roles: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: null })
  updateAt: Date;

  @Prop({ default: null })
  phoneNumber: string;

  @Prop({ default: null })
  address: string;

  @Prop({ default: null })
  age: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongooseUniqueValidator, { message: 'Tài khoản đã tồn tại' });
