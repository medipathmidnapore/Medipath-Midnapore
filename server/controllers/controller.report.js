import crypto from 'crypto';
import { verifyReport } from '../utils/service.mainserver.js';
import { verifyRecaptcha } from '../utils/verifyRecaptcha.js';
import OtpTicket from '../models/model.otpticket.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_OTP_ATTEMPTS = 3;

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
    'Your report is ready! An OTP has been sent to your registered mobile number.',
  AUTH_FAIL:
    'We are experiencing a temporary authentication issue with the main server. Please try again shortly or contact reception.',
  TECH_FAIL:
    'The main server encountered a technical issue. Please try again later.',
  REQUEST_EMPTY:
    'Some required information was missing. Please check your mobile number and collection date, then try again.',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generates a cryptographically random ticket ID. */
function generateTicketId() {
  return crypto.randomBytes(24).toString('hex');
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /api/reports/lookup
 *
 * Step 1 of 2 in the OTP lockbox flow.
 *
 * - Proxies the lookup to the Main Server.
 * - For REPORT_READY: stores [otp + reportUrl] in the DB, returns only a ticketId.
 * - For all other statuses: returns status info as before (nothing sensitive to protect).
 *
 * The reportUrl is NEVER sent to the client from this endpoint.
 */
export const lookupReport = async (req, res) => {
  try {
    const { mobile, collectionDate, recaptchaToken } = req.query;

    // ── CAPTCHA ──
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
      const finalMessage =
        response?.message && response.message.trim() !== ''
          ? response.message
          : fallbackMessage;

      // ── REPORT_READY: OTP Lockbox ──────────────────────────────────────────
      if (status === 'REPORT_READY') {
        const otp = response?.otpHash ? String(response.otpHash).trim() : null;
        const reportUrl = response?.reportUrl ? String(response.reportUrl).trim() : null;

        if (!otp || !reportUrl) {
          // Main server returned REPORT_READY but without the necessary secure data
          console.error('[lookupReport] REPORT_READY but otp or reportUrl is missing from main server response.');
          return res.status(502).json({
            success: false,
            message: 'The main server did not return the required report data. Please try again.',
          });
        }

        // Store the sensitive data; generate a one-time ticket for the client
        const ticketId = generateTicketId();
        await OtpTicket.create({
          ticketId,
          otp,
          reportUrl,
          status,
          message: finalMessage,
          mobile: mobile.trim(),
        });

        console.log(`[OTP Lockbox] Ticket created for mobile ${mobile.trim()} — ticketId: ${ticketId}`);

        // Return ONLY the ticket. reportUrl and otp never leave the server.
        return res.status(200).json({
          success: true,
          data: {
            status,
            message: finalMessage,
            ticketId,          // Frontend uses this to call /verify-otp
            requiresOtp: true, // Signal to the frontend to show the OTP step
          },
        });
      }

      // ── All other statuses: pass through (no reportUrl to protect) ──────────
      return res.status(200).json({
        success: true,
        data: {
          status,
          reportUrl: '',
          message: finalMessage,
          qrSRC: response?.qrSRC || '',
          ...(response?.api_type && { api_type: response.api_type }),
        },
      });
    } catch (fetchError) {
      console.error('Error calling main server for report lookup:', fetchError.message);

      if (fetchError.data && fetchError.data.status) {
        const status = fetchError.data.status;
        const errMessage =
          fetchError.data.message && fetchError.data.message.trim() !== ''
            ? fetchError.data.message
            : STATUS_MESSAGES[status] || STATUS_MESSAGES.TECH_FAIL;

        return res.status(200).json({
          success: true,
          data: {
            status,
            reportUrl: '',
            message: errMessage,
            qrSRC: fetchError.data.qrSRC || '',
          },
        });
      }

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
 * POST /api/reports/verify-otp
 *
 * Step 2 of 2 in the OTP lockbox flow.
 *
 * Body: { ticketId: string, otp: string }
 *
 * - Looks up the ticket by ticketId.
 * - Validates the OTP against the stored value.
 * - On success: deletes the ticket and returns the reportUrl (one-time release).
 * - On failure: increments attempt counter; locks ticket after MAX_OTP_ATTEMPTS.
 */
export const verifyOtp = async (req, res) => {
  try {
    const { ticketId, otp } = req.body;

    if (!ticketId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID and OTP are required.',
      });
    }

    const ticket = await OtpTicket.findOne({ ticketId });

    // Ticket not found (expired or never existed or already used)
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'This OTP session has expired or is invalid. Please search for your report again.',
        code: 'TICKET_NOT_FOUND',
      });
    }

    // Ticket is locked due to too many wrong attempts
    if (ticket.attempts >= MAX_OTP_ATTEMPTS) {
      await OtpTicket.deleteOne({ ticketId });
      return res.status(403).json({
        success: false,
        message: 'Too many incorrect attempts. This session has been locked. Please search again.',
        code: 'TICKET_LOCKED',
      });
    }

    // ── OTP Mismatch ─────────────────────────────────────────────────────────
    // 1. Convert text to a byte array
  const encoder = new TextEncoder();
  const data = encoder.encode(String(otp).trim());
  
  // 2. Hash the data using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // 3. Convert the byte array back to a readable hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');


    if (String(hashHex).trim() !== String(ticket.otp).trim()) {
      ticket.attempts += 1;
      await ticket.save();

      const remaining = MAX_OTP_ATTEMPTS - ticket.attempts;
      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Incorrect OTP. You have ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          : 'Incorrect OTP. You have no attempts remaining.',
        code: 'OTP_MISMATCH',
        attemptsRemaining: remaining,
      });
    }

    // ── OTP Match: Release URL and delete the ticket ──────────────────────────
    let { reportUrl } = ticket;
    reportUrl=reportUrl+"&otp="+String(otp).trim();
    await OtpTicket.deleteOne({ ticketId });

    console.log(`[OTP Lockbox] Ticket verified & deleted for mobile ${ticket.mobile} — ticketId: ${ticketId}`);

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      data: {
        reportUrl,
      },
    });
  } catch (error) {
    console.error('verifyOtp error:', error);
    res.status(500).json({ success: false, message: 'OTP verification failed. Please try again.' });
  }
};

/**
 * POST /api/reports
 * Removed — report uploads are handled strictly by the Main Server.
 */
export const createReport = async (req, res) => {
  res.status(403).json({ success: false, message: 'Report uploads are managed by the Main Server.' });
};
