import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile1: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    mobile2: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    tests: [
      {
        testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        name: String,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    balanceDue: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMode: {
      type: String,
      enum: ['full', 'advance50', 'unpaid'],
      default: 'unpaid',
    },
    prescriptionUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'collected', 'reported', 'cancelled'],
      default: 'pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
