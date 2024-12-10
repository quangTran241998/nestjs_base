import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLE } from './../modules/auth/roles/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
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

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
