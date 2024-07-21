import { Role } from './../modules/auth/roles/roles.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ enum: [Role.User, Role.Admin], default: Role.User })
  roles: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
