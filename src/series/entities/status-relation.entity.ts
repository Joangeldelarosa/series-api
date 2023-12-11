import * as mongoose from 'mongoose';
import { Status } from './status.entity';

export interface StatusRelation {
  _id?: mongoose.Types.ObjectId;
  type: string;
  statuses: mongoose.Types.ObjectId[] | Status[];
}
