import * as mongoose from 'mongoose';

// Schema: Character (_id, id, currentStatus [relation], name, status, specie, type, gender, origin, location, image, url, createdAt, updatedAt)
export const CharacterSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  currentStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  specie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  type: {
    type: String,
  },
  gender: {
    type: String,
  },
  origin: {
    type: Object,
  },
  location: {
    type: Object,
  },
  image: {
    type: String,
  },
  url: {
    type: String,
  },
  created: {
    type: Date,
  },
});

// Model: Character
const Character = mongoose.model('Character', CharacterSchema);

export default Character;
