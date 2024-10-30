import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import * as mongooseUniqueValidator from 'mongoose-unique-validator';
import { ROLE } from './../modules/auth/roles/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  // @Prop({ required: true, unique: true })
  // _id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: ROLE, default: ROLE.User })
  role: string;

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

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
// UserSchema.plugin(mongooseUniqueValidator, { message: 'Tài khoản đã tồn tại' });
