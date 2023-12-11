import * as mongoose from 'mongoose';

// Schema: Category (_id, name)
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Model: Category
const Category = mongoose.model('Category', CategorySchema);

export default Category;
