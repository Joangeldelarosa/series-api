import * as mongoose from 'mongoose';

export interface Category {
  _id?: mongoose.Types.ObjectId;
  name: string;
}
