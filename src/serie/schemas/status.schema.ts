import * as mongoose from 'mongoose';

// Schema: Status (_id, name)
const StatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Model: Status
const Status = mongoose.model('Status', StatusSchema);

export default Status;
