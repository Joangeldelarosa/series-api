import * as mongoose from 'mongoose';

// Schema: CategoryRelation (_id, category [relation], subcategories)
const CategoryRelationSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  subcategories: [
    {
      type: String,
    },
  ],
});

// Model: CategoryRelation
const CategoryRelation = mongoose.model(
  'CategoryRelation',
  CategoryRelationSchema,
);

export default CategoryRelation;
