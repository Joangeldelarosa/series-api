import * as mongoose from 'mongoose';

// Schema: Category (_id, name)
export const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// Model: Category
const Category = mongoose.model('Category', CategorySchema);

export default Category;
