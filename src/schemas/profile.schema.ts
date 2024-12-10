import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ default: null })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  phoneNumber: string;

  @Prop({ default: null })
  address: string;

  @Prop({ default: null })
  age: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: null })
  updateAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
