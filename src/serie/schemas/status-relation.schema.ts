import * as mongoose from 'mongoose';

// Schema: StatusRelation (_id, type, statuses [relation])
const StatusRelationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  statuses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Status',
    },
  ],
});

// Model: StatusRelation
const StatusRelation = mongoose.model('StatusRelation', StatusRelationSchema);

export default StatusRelation;
