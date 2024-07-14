import { Document } from 'mongoose';

export interface BannerHome extends Document {
  readonly title: string;
  readonly desc: string;
  readonly img: string;
}
