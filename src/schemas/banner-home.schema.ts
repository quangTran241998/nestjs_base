// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';
// import { Document } from 'mongoose';

// export type CatDocument = HydratedDocument<Cat>;

// @Schema()
// export class Cat {
//   @Prop()
//   name: string;

//   @Prop()
//   color: string;

//   @Prop()
//   id: number;
// }

// export const CatSchema = SchemaFactory.createForClass(Cat);

import { Schema } from 'mongoose';

export const BannerHomeSchema = new Schema({
  title: String,
  desc: String,
});
