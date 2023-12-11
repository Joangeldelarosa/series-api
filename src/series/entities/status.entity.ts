import * as mongoose from 'mongoose';

export interface Status {
  _id?: mongoose.Types.ObjectId;
  name: string;
}
