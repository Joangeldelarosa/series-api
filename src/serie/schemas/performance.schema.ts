import * as mongoose from 'mongoose';

// Schema: Performance (_id, interval [{ start, end }], episode [relation], character [relation])
export const PerformanceSchema = new mongoose.Schema({
  interval: [
    {
      start: {
        type: Number,
        required: true,
      },
      end: {
        type: Number,
        required: true,
      },
    },
  ],
  episode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episode',
  },
  character: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  },
});

// Model: Performance
const Performance = mongoose.model('Performance', PerformanceSchema);

export default Performance;
