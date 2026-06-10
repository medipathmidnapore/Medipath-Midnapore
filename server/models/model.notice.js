import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPermanent: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    enum: ['nominal', 'important'],
    default: 'nominal'
  },
  publishAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
  }
}, { timestamps: true });

export default mongoose.model('Notice', NoticeSchema);
