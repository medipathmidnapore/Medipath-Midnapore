import Booking from '../models/model.booking.js';
import { sendBooking } from '../utils/service.mainserver.js';
import { verifyRecaptcha } from '../utils/verifyRecaptcha.js';

/**
 * POST /api/bookings
 * Saves to local MongoDB, then forwards the booking to the main server via SEND_BOOKING.
 * Includes prescriptionUrl and prescriptionExtension in the payload.
 */
export const createBooking = async (req, res) => {
  try {
    const { patientName, mobile1, address, tests, prescriptionUrl, prescriptionExtension, notes, recaptchaToken } = req.body;

    // Verify CAPTCHA
    const isCaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification failed. Please try again.',
      });
    }

    if (!patientName || !mobile1 || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientName, mobile1, address.',
      });
    }

    let totalAmount = 0;
    if (tests && tests.length > 0) {
       totalAmount = tests.reduce((sum, test) => sum + (Number(test.price) || 0), 0);
    }

    // Save to local proxy DB first
    const newBooking = await Booking.create({
       patientName,
       mobile1,
       mobile2: req.body.mobile2 || '',
       email: req.body.email || '',
       address,
       tests: tests || [],
       totalAmount,
       balanceDue: totalAmount,
       paymentMode: 'unpaid',
       prescriptionUrl: prescriptionUrl || '',
       notes: notes || '',
       status: 'pending'
    });

    // Build payload for main server
    const payload = {
      patientName,
      mobile: mobile1,
      mobile2: req.body.mobile2 || '',
      email: req.body.email || '',
      address,
      notes: notes || '',
      tests: '',
    };

    // Add tests as array if present
    if (tests && tests.length > 0) {
      payload.tests = tests.map((t) => ({
        testId: String(t.testId || ''),
        name: String(t.name || ''),
        price: String(t.price || ''),
      }));
      payload.totalAmount = String(totalAmount);
    }

    // Add prescription info if present
    if (prescriptionUrl) {
      payload.prescriptionUrl = prescriptionUrl;
    }
    if (prescriptionExtension) {
      payload.prescriptionExtension = prescriptionExtension;
    }

    // Forward to main server
    console.log(`Forwarding booking to main server for patient: ${patientName}`);

    try {
      const mainResponse = await sendBooking(payload);

      // Forwarding successful — delete from local proxy DB to keep it clean
      await Booking.findByIdAndDelete(newBooking._id);

      res.status(201).json({
        success: true,
        message: 'Booking forwarded successfully to the main server.',
        data: mainResponse,
      });
    } catch (fetchError) {
      console.error('Error forwarding booking to main server:', fetchError.message);

      // Booking is still saved locally as a fallback
      res.status(201).json({
        success: true,
        message: 'Booking saved locally. Forwarding to main server failed — our team will process it manually.',
        data: {
          status: 'saved_locally',
          localBookingId: newBooking._id,
        },
      });
    }
  } catch (error) {
    console.error('createBooking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking.' });
  }
};

/**
 * GET /api/bookings/:id
 * Fetch a single booking by ID from the local proxy database.
 */
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking.' });
  }
};
