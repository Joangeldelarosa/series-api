import * as mongoose from 'mongoose';

// Schema: Character (_id, id, currentStatus [relation], name, status, specie, type, gender, origin, location, image, url, createdAt, updatedAt)
const CharacterSchema = new mongoose.Schema({
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
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  origin: {
    name: {
      type: String,
    },
    url: {
      type: Date,
    },
  },
  location: {
    name: {
      type: String,
    },
    url: {
      type: Date,
    },
  },
  image: {
    type: String,
  },
  url: {
    type: Date,
  },
  created: {
    type: Date,
  },
});

// Model: Character
const Character = mongoose.model('Character', CharacterSchema);

export default Character;
