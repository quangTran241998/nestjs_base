import { Document } from 'mongoose';

export interface Cat extends Document {
  readonly catId: string;
  readonly name: string;
  readonly color: string;
}
