import * as mongoose from 'mongoose';
import { Status } from './status.entity';
import { Category } from './category.entity';

export interface Character {
  _id?: mongoose.Types.ObjectId;
  currentStatus?: mongoose.Types.ObjectId | Status;
  name: string;
  status?: string;
  specie: mongoose.Types.ObjectId | Category | string;
  type: string;
  species?: string;
  episode?: string[];
  gender?: string;
  origin?: object;
  location?: object;
  image?: string;
  created?: Date;
}
