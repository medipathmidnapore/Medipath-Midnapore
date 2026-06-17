import { verifyReport } from '../utils/service.mainserver.js';
import { verifyRecaptcha } from '../utils/verifyRecaptcha.js';

/**
 * Status code → user-friendly message map.
 * These are the 8 status codes the main server can return for VERIFY_REPORT_DETAILS.
 */
const STATUS_MESSAGES = {
  NOT_FOUND:
    'No reports found matching your details. Please verify your mobile number and collection date, then try again.',
  MULTIPLE_FOUND:
    'Multiple reports found for these details. Please contact the Medipath reception at +91 90832 76651 for assistance.',
  REPORT_PENDING:
    'Your report is being processed. Please check back in a few hours.',
  PAYMENT_PENDING:
    'Your payment information is not updated on the system. Please contact Medipath.',
  REPORT_READY:
    'Your report is ready! You can download it below.',
  AUTH_FAIL:
    'We are experiencing a temporary authentication issue with the main server. Please try again shortly or contact reception.',
  TECH_FAIL:
    'The main server encountered a technical issue. Please try again later.',
  REQUEST_EMPTY:
    'Some required information was missing. Please check your mobile number and collection date, then try again.',
};

/**
 * GET /api/reports/lookup
 * Proxies the request to the main server's VERIFY_REPORT_DETAILS API.
 *
 * Required query params:
 *   - mobile          10-digit mobile number
 *   - collectionDate  Date in yyyy-MM-dd format
 *
 * Main server response fields: api_type, status, reportUrl, message, qrSRC
 */
export const lookupReport = async (req, res) => {
  try {
    const { mobile, collectionDate, recaptchaToken } = req.query;

    // Verify CAPTCHA
    const isCaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification failed. Please try again.',
      });
    }

    // ── Validation ──
    if (!mobile || mobile.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'A valid 10-digit mobile number is required.',
      });
    }

    if (!collectionDate || !collectionDate.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Collection date is required (format: yyyy-MM-dd).',
      });
    }

    // Validate date format (yyyy-MM-dd)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(collectionDate.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use yyyy-MM-dd (e.g. 2026-06-12).',
      });
    }

    // ── Call Main Server ──
    try {
      const response = await verifyReport(mobile.trim(), collectionDate.trim());

      const status = response?.status || 'TECH_FAIL';
      const fallbackMessage = STATUS_MESSAGES[status] || STATUS_MESSAGES.TECH_FAIL;
      
      // Prioritize the main server message if it exists and is not empty
      const finalMessage = (response?.message && response.message.trim() !== '') 
        ? response.message 
        : fallbackMessage;

      return res.status(200).json({
        success: true,
        data: {
          status,
          reportUrl: response?.reportUrl || '',
          message: finalMessage,
          qrSRC: response?.qrSRC || '',
          // Pass through any additional fields the main server might send
          ...(response?.api_type && { api_type: response.api_type }),
        },
      });
    } catch (fetchError) {
      console.error('Error calling main server for report lookup:', fetchError.message);

      // If the main server returned a structured error, try to extract it
      if (fetchError.data && fetchError.data.status) {
        const status = fetchError.data.status;
        const errMessage = (fetchError.data.message && fetchError.data.message.trim() !== '') 
          ? fetchError.data.message 
          : (STATUS_MESSAGES[status] || STATUS_MESSAGES.TECH_FAIL);

        return res.status(200).json({
          success: true,
          data: {
            status,
            reportUrl: fetchError.data.reportUrl || '',
            message: errMessage,
            qrSRC: fetchError.data.qrSRC || '',
          },
        });
      }

      // Generic server communication failure
      return res.status(502).json({
        success: false,
        message: 'Could not reach the main server to verify your report. Please try again later.',
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
