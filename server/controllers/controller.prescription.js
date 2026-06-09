import cloudinary from '../config/config.cloudinary.js';
import { Readable } from 'stream';

/**
 * POST /api/prescriptions/upload
 * Accepts multipart/form-data with a file field named 'prescription'.
 * Streams directly to Cloudinary and saves the secure URL.
 * Does NOT save to local DB anymore, just returns URL for frontend to use in booking proxy.
 */
export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided.' });
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
 * Fetch all standalone prescriptions
 * Now removed since we don't store them locally.
 */
export const getAllPrescriptions = async (req, res) => {
  res.status(403).json({ success: false, message: 'Prescriptions are managed by the Main Server.' });
};

