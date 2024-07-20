import { Schema } from 'mongoose';

export const ArticleSchema = new Schema({
  // title: String,
  // desc: String,
  // content: String,
  // img: String,
  title: String,
  imgTitle: String,
  content: String,
  story: String,
  document: String,
  update: String,
  share: Number,
  name: String,
  addressHispital: String,
  diseaseName: String,
});
