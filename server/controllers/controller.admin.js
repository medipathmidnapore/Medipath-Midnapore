import jwt from 'jsonwebtoken';
import Booking from '../models/model.booking.js';

// Login as Admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: 'admin1', role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ success: true, token, role: 'admin' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sync booking to main server manually
import { sendBooking } from '../utils/service.mainserver.js';

export const syncBookingToMain = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.isSynced) {
      return res.status(400).json({ success: false, message: 'Booking is already synced' });
    }

    // Build payload for main server
    const payload = {
      patientName: booking.patientName,
      mobile: booking.mobile1,
      mobile2: booking.mobile2 || '',
      email: booking.email || '',
      address: booking.address,
      notes: booking.notes || '',
      tests: '',
    };

    if (booking.tests && booking.tests.length > 0) {
      payload.tests = booking.tests.map((t) => ({
        testId: String(t.testId || ''),
        name: String(t.name || ''),
        price: String(t.price || ''),
      }));
      payload.totalAmount = String(booking.totalAmount);
    }

    if (booking.prescriptionUrl) {
      payload.prescriptionUrl = booking.prescriptionUrl;
      // Note: We don't have prescriptionExtension saved directly in the model natively,
      // but the main server usually just accepts the URL anyway if it's already uploaded.
    }

    // Forward to main server
    const mainResponse = await sendBooking(payload);

    // Update sync status
    booking.isSynced = true;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking successfully synced to main server.',
      data: booking,
    });
  } catch (error) {
    console.error('Error syncing booking to main server:', error.message);
    res.status(500).json({
      success: false,
      message: error.data?.message || 'Failed to sync booking to main server. Please check the proxy logs.',
    });
  }
};
