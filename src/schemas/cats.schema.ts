import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatDocument = Cat & Document;

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop()
  userId: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
