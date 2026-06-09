// Report Controller - Proxy to Main Server

/**
 * GET /api/reports/lookup
 * Proxies the request to the Main Server Verification API.
 * Expected Main Server responses:
 * 1. { status: 'ready', reportUrl: '...' }
 * 2. { status: 'wait_normal', message: 'Report is still processing...' }
 * 3. { status: 'wait_payment', phone: '...', qrSrc: '...' }
 */
export const lookupReport = async (req, res) => {
  try {
    const { billNo, mobile } = req.query;

    if (!billNo || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Bill number and mobile are required.',
      });
    }

    const mainServerUrl = process.env.MAIN_SERVER_URL || 'http://localhost:5001';
    
    console.log(`Forwarding report lookup to ${mainServerUrl}/api/verify-report?billNo=${billNo}&mobile=${mobile}`);

    try {
      const response = await fetch(`${mainServerUrl}/api/verify-report?billNo=${billNo}&mobile=${mobile}`, {
        method: 'GET',
        headers: {
          'x-api-key': process.env.MAIN_SERVER_API_KEY || ''
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({
            success: false,
            message: 'No report found. Please check your Bill No. and mobile number.'
          });
        }
        throw new Error(`Main server responded with status: ${response.status}`);
      }

      const responseData = await response.json();
      
      res.status(200).json({ success: true, data: responseData });

    } catch (fetchError) {
      console.error('Error forwarding report lookup:', fetchError);
      
      // Fallback simulated response for development
      res.status(200).json({
        success: true,
        data: {
          status: 'wait_normal', // 'ready' | 'wait_normal' | 'wait_payment'
          message: 'Simulated fallback: Report is processing...',
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
 * Removed as report uploads are now handled strictly by the Main Server.
 */
export const createReport = async (req, res) => {
  res.status(403).json({ success: false, message: 'Report uploads are managed by the Main Server.' });
};

