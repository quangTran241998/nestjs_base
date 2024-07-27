import { Schema } from 'mongoose';

export const CatSchema = new Schema({
  catId: String,
  name: String,
  color: String,
});
