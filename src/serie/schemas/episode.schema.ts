import * as mongoose from 'mongoose';

// Schema: Episode (_id, name, currentStatus [relation], air_date, season, duration)
const EpisodeSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  currentStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  },
  air_date: {
    type: String,
  },
  season: {
    type: String,
  },
  duration: {
    type: Number,
  },
});

// Model: Episode
const Episode = mongoose.model('Episode', EpisodeSchema);

export default Episode;
