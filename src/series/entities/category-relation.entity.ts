import * as mongoose from 'mongoose';
import { Category } from './category.entity';

export interface CategoryRelation {
  _id?: mongoose.Types.ObjectId;
  category: string;
  subcategories: mongoose.Types.ObjectId[] | Category[];
}
