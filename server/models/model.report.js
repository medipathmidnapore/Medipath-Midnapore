import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    billNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    serialNo: {
      type: String,
      trim: true,
      default: '',
    },
    patientName: {
      type: String,
      trim: true,
      default: '',
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    reportUrl: {
      type: String,
      default: '',
    },
    balanceDue: {
      type: Number,
      default: 0,
      min: 0,
    },
    isLocked: {
      type: Boolean,
      default: true,
    },
    tests: [{ type: String }],
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
