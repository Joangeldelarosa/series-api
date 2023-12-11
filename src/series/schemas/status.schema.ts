import * as mongoose from 'mongoose';

// Schema: Status (_id, name)
export const StatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// Model: Status
const Status = mongoose.model('Status', StatusSchema);

export default Status;
