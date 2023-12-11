import * as mongoose from 'mongoose';

// Schema: Episode (_id, name, currentStatus [relation], air_date, season, duration)
export const EpisodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  currentStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  },
  air_date: {
    type: String,
  },
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  duration: {
    type: Number,
    max: 3600,
  },
});

// Model: Episode
const Episode = mongoose.model('Episode', EpisodeSchema);

export default Episode;
