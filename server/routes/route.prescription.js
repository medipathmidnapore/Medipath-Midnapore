import { Router } from 'express';
import multer from 'multer';
import { uploadPrescription } from '../controllers/controller.prescription.js';

// Memory storage — buffer is streamed directly to Cloudinary, nothing saved to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and PDF are allowed.'));
    }
  },
});

const router = Router();

// POST /api/prescriptions/upload
router.post('/upload', upload.single('prescription'), uploadPrescription);

export default router;
