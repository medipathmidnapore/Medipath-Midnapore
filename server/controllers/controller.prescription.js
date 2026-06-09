import cloudinary from '../config/config.cloudinary.js';
import Prescription from '../models/model.prescription.js';
import Booking from '../models/model.booking.js';
import { Readable } from 'stream';

/**
 * POST /api/prescriptions/upload
 * Accepts multipart/form-data with a file field named 'prescription'.
 * Streams directly to Cloudinary and saves the secure URL.
 */
export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided.' });
    }

    const { patientName, mobileNumber, bookingId, email } = req.body;

    if (!patientName || !mobileNumber) {
      return res.status(400).json({ success: false, message: 'Patient Name and Mobile Number are required.' });
    }

    // Determine resource type
    const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';

    // Stream buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'medipath/prescriptions',
          resource_type: resourceType,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      const readable = Readable.from(req.file.buffer);
      readable.pipe(uploadStream);
    });

    // Save standalone prescription
    const prescriptionRecord = await Prescription.create({
      patientName,
      mobileNumber,
      email: email || '',
      prescriptionUrl: uploadResult.secure_url,
    });

    // If a bookingId was provided (from a booking flow), also link it to the booking
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        prescriptionUrl: uploadResult.secure_url,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription uploaded successfully.',
      cloudinaryUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error('uploadPrescription error:', error);
    res.status(500).json({ success: false, message: 'Upload failed. Please try again.' });
  }
};

/**
 * GET /api/prescriptions
 * Fetch all standalone prescriptions (Admin Only)
 */
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
