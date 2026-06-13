import cloudinary from '../config/config.cloudinary.js';
import { Readable } from 'stream';
import path from 'path';

/**
 * POST /api/prescriptions/upload
 * Accepts multipart/form-data with a file field named 'prescription'.
 * Streams directly to Cloudinary and returns the secure URL + file extension.
 *
 * Allowed formats: JPG, JPEG, PNG, PDF (no WEBP — main server restriction)
 */
export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided.' });
    }

    // Extract file extension
    const originalName = req.file.originalname || '';
    const fileExtension = path.extname(originalName).replace('.', '').toUpperCase() || '';

    // Validate extension (double-check even though multer filters)
    const allowedExtensions = ['JPG', 'JPEG', 'PNG', 'PDF'];
    if (fileExtension && !allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type (.${fileExtension}). Only JPG, JPEG, PNG, and PDF are allowed.`,
      });
    }

    // Determine resource type
    const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';

    // Stream buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'medipath/prescriptions',
          resource_type: resourceType,
          allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Prevent unhandled stream errors from crashing Node process
      uploadStream.on('error', (err) => reject(err));

      const readable = Readable.from(req.file.buffer);
      readable.on('error', (err) => reject(err));
      
      readable.pipe(uploadStream);
    });

    res.status(200).json({
      success: true,
      message: 'Prescription uploaded successfully.',
      cloudinaryUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileExtension, // e.g. "JPG", "PNG", "PDF"
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
