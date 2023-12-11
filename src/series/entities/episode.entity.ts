import * as mongoose from 'mongoose';
import { Status } from './status.entity';
import { Category } from './category.entity';

export interface Episode {
  _id?: mongoose.Types.ObjectId;
  name: string;
  currentStatus?: mongoose.Types.ObjectId | Status;
  air_date?: string;
  season?: mongoose.Types.ObjectId | Category | string;
  episode?: string;
  characters?: string[];
  duration?: number;
}
