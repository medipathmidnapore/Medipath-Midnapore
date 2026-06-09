import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  prescriptionUrl: {
    type: String,
    required: [true, 'Prescription URL is required'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Contacted'],
    default: 'Pending',
  }
}, { timestamps: true });

export default mongoose.model('Prescription', PrescriptionSchema);
