import * as mongoose from 'mongoose';

// Schema: CategoryRelation (_id, category [relation], subcategories)
export const CategoryRelationSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      unique: true,
    },
  ],
});

// Model: CategoryRelation
const CategoryRelation = mongoose.model(
  'CategoryRelation',
  CategoryRelationSchema,
);

export default CategoryRelation;
