import { Document } from 'mongoose';

export interface Article extends Document {
  readonly title: string;
  readonly imgTitle: string;
  readonly content: string;
  readonly story: string;
  readonly document: string;
  readonly update: string;
  readonly share: number;
  readonly name: string;
  readonly addressHispital: string;
  readonly diseaseName: string;
}
