// Report Controller - Proxy to Main Server

/**
 * GET /api/reports/lookup
 * Proxies the request to the Main Server Verification API.
 *
 * Required:  mobile
 * Optional (at least one required): billNo | collectionDate
 *
 * Expected Main Server responses:
 * 1. { status: 'ready', reportUrl: '...' }
 * 2. { status: 'wait_normal', message: 'Report is still processing...' }
 * 3. { status: 'wait_payment', phone: '...', qrSrc: '...' }
 */
export const lookupReport = async (req, res) => {
  try {
    const { billNo, mobile, collectionDate } = req.query;

    // Mobile is always required
    if (!mobile || mobile.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'A valid mobile number is required.',
      });
    }

    // At least one identifier (billNo OR collectionDate) must be provided
    if (!billNo?.trim() && !collectionDate?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a Bill Number or your Collection Date.',
      });
    }

    const mainServerUrl = process.env.MAIN_SERVER_URL || 'http://localhost:5001';

    // Build query string — only include fields the patient provided
    const queryParams = new URLSearchParams({ mobile: mobile.trim() });
    if (billNo?.trim())         queryParams.set('billNo', billNo.trim());
    if (collectionDate?.trim()) queryParams.set('collectionDate', collectionDate.trim());

    const lookupUrl = `${mainServerUrl}/api/verify-report?${queryParams.toString()}`;
    console.log(`Forwarding report lookup → ${lookupUrl}`);

    try {
      const response = await fetch(lookupUrl, {
        method: 'GET',
        headers: {
          'x-api-key': process.env.MAIN_SERVER_API_KEY || ''
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({
            success: false,
            message: 'No report found. Please verify your details and try again.'
          });
        }
        throw new Error(`Main server responded with status: ${response.status}`);
      }

      const responseData = await response.json();
      return res.status(200).json({ success: true, data: responseData });

    } catch (fetchError) {
      console.error('Error forwarding report lookup:', fetchError);

      // Development fallback — simulates a response when main server is unreachable
      return res.status(200).json({
        success: true,
        data: {
          status: 'wait_normal',
          message: 'Simulated fallback: Report is still being processed…',
        }
      });
    }

  } catch (error) {
    console.error('lookupReport proxy error:', error);
    res.status(500).json({ success: false, message: 'Report lookup failed.' });
  }
};

/**
 * POST /api/reports
 * Removed — report uploads are handled strictly by the Main Server.
 */
export const createReport = async (req, res) => {
  res.status(403).json({ success: false, message: 'Report uploads are managed by the Main Server.' });
};
