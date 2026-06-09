import Booking from '../models/model.booking.js';
import { sendBookingConfirmation } from '../utils/util.mailer.js';

/**
 * POST /api/bookings
 * Creates a new booking record with patient info, tests, and payment details.
 */
export const createBooking = async (req, res) => {
  try {
    const { patientName, mobile1, mobile2, email, address, tests, paymentMode } = req.body;

    if (!patientName || !mobile1 || !address || !tests || tests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientName, mobile1, address, tests.',
      });
    }

    const totalAmount = tests.reduce((sum, t) => sum + Number(t.price), 0);

    let amountPaid = 0;
    if (paymentMode === 'full') {
      amountPaid = totalAmount;
    } else if (paymentMode === 'advance50') {
      amountPaid = Math.ceil(totalAmount / 2);
    }

    const balanceDue = totalAmount - amountPaid;

    const booking = await Booking.create({
      patientName,
      mobile1,
      mobile2: mobile2 || '',
      email: email || '',
      address,
      tests,
      totalAmount,
      amountPaid,
      balanceDue,
      paymentMode: paymentMode || 'unpaid',
    });

    // Send confirmation email (non-blocking)
    const emailRecipients = email ? `${process.env.GMAIL_USER}, ${email}` : process.env.GMAIL_USER;
    
    sendBookingConfirmation({
      to: emailRecipients,
      patientName,
      tests,
      totalAmount,
      amountPaid,
      balanceDue,
      bookingId: booking._id,
    }).then(sent => {
      if (sent && email) {
        Booking.findByIdAndUpdate(booking._id, { emailSent: true }).catch(console.error);
      }
    }).catch((err) => console.error('Email send failed:', err));

    res.status(201).json({
      success: true,
      message: 'Booking created successfully.',
      data: {
        bookingId: booking._id,
        patientName: booking.patientName,
        totalAmount: booking.totalAmount,
        amountPaid: booking.amountPaid,
        balanceDue: booking.balanceDue,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error('createBooking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking.' });
  }
};

/**
 * GET /api/bookings/:id
 * Fetch a single booking by ID.
 */
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking.' });
  }
};
