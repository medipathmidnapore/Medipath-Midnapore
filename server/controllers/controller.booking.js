import Booking from '../models/model.booking.js';

// Booking Controller - Proxy to Main Server
// We save to the local MongoDB database to keep track, then forward.

/**
 * POST /api/bookings
 * Saves locally, then forwards the booking (and optional prescription URL) to the main server.
 */
export const createBooking = async (req, res) => {
  try {
    const { patientName, mobile1, address, tests, prescriptionUrl } = req.body;

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
       balanceDue: totalAmount, // Assuming unpaid initially since we removed payment from proxy
       paymentMode: 'unpaid',
       prescriptionUrl: prescriptionUrl || '',
       status: 'pending'
    });

    const payload = {
       proxyBookingId: newBooking._id,
       ...req.body
    };

    // Proxy request to the main server
    const mainServerUrl = process.env.MAIN_SERVER_URL || 'http://localhost:5001';
    
    console.log(`Forwarding booking to main server at ${mainServerUrl}/api/bookings`);
    
    try {
      const response = await fetch(`${mainServerUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.MAIN_SERVER_API_KEY || ''
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
         throw new Error(`Main server responded with status: ${response.status}`);
      }

      const responseData = await response.json();

      // Forwarding successful, so we delete it from our local proxy DB to keep it clean!
      await Booking.findByIdAndDelete(newBooking._id);

      res.status(201).json({
        success: true,
        message: 'Booking forwarded successfully and removed from local proxy.',
        data: responseData
      });
      
    } catch (fetchError) {
      console.error('Error forwarding to main server:', fetchError);
      // Fallback response for development/testing if main server is not up
      res.status(201).json({
        success: true,
        message: 'Booking saved locally, but forwarding failed (simulated fallback).',
        data: {
          status: 'simulated_success',
          localBookingId: newBooking._id
        }
      });
    }

  } catch (error) {
    console.error('createBooking proxy error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking.' });
  }
};

/**
 * GET /api/bookings/:id
 * Fetch a single booking by ID.
 * Since we don't store locally, proxy this to the main server.
 */
export const getBooking = async (req, res) => {
  try {
    const mainServerUrl = process.env.MAIN_SERVER_URL || 'http://localhost:5001';
    const response = await fetch(`${mainServerUrl}/api/bookings/${req.params.id}`, {
       headers: {
         'x-api-key': process.env.MAIN_SERVER_API_KEY || ''
       }
    });

    if (!response.ok) {
       return res.status(response.status).json({ success: false, message: 'Booking not found on main server.' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking.' });
  }
};

