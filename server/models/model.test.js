import mongoose from 'mongoose';

const DEPARTMENTS = [
  'HAEMATOLOGY',
  'BIOCHEMISTRY',
  'ENDOCRINOLOGY & SPECIAL',
  'URINE EXAMINATION',
  'STOOL EXAMINATION',
  'SEROLOGY',
  'HISTOPATHOLOGY',
  'CYTOLOGY',
  'MICROBIOLOGY',
  'ANDROLOGY',
  'IMMUNOLOGY',
  'General',
];

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    department: {
      type: String,
      trim: true,
      enum: DEPARTMENTS,
      default: 'General',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    turnaroundHours: {
      type: Number,
      default: 24,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

testSchema.index({ name: 'text', category: 'text' });
testSchema.index({ department: 1 });

const Test = mongoose.model('Test', testSchema);
export { DEPARTMENTS };
export default Test;
