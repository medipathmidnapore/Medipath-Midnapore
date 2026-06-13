/**
 * Main Server Service — Centralized caller for the GetCharge API.
 *
 * Architecture:
 * - Single endpoint: MAIN_SERVER_URL (https://www.getcharge.in/medipath/web/api)
 * - Auth: x-webhook-secret header with MAIN_SERVER_SECRET_KEY
 * - Operations distinguished by the `api_type` parameter
 *
 * API Types:
 *   GET_TEST_PRICE       → Fetch test catalog (name, id, price, status)
 *   VERIFY_REPORT_DETAILS → Lookup report by mobile + collectionDate (yyyy-MM-dd)
 *   SEND_BOOKING          → Forward a booking to the main server
 */

// ─── Constants ────────────────────────────────────────────
const API_TYPES = {
  GET_TEST_PRICE: 'GET_TEST_PRICE',
  VERIFY_REPORT_DETAILS: 'VERIFY_REPORT_DETAILS',
  SEND_BOOKING: 'SEND_BOOKING',
};

const TIMEOUT_MS = 15000; // 15 second timeout

// ─── Generic Caller ───────────────────────────────────────
/**
 * Makes an authenticated POST request to the main server.
 *
 * @param {string} apiType   One of API_TYPES
 * @param {object} params    Additional key-value pairs to send
 * @returns {object}         Parsed JSON response from the main server
 * @throws {Error}           On network error, timeout, or non-OK response
 */
export async function callMainServer(apiType, params = {}) {
  const targetUrl = process.env.MAIN_SERVER_URL;
  const secretKey = process.env.MAIN_SERVER_SECRET_KEY;

  if (!targetUrl || !secretKey) {
    throw new Error('Main server URL or secret key is not configured in environment variables.');
  }

  const targetUrlWithParams = `${targetUrl}?api_type=${apiType}`;
  const bodyPayload = { ...params };
  const bodyString = JSON.stringify(bodyPayload);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    console.log(`[MainServer] → ${apiType}`, bodyPayload);

    const response = await fetch(targetUrlWithParams, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': secretKey,
      },
      body: bodyString,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response regardless of status — main server may return JSON error bodies
    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Try to parse as JSON, fall back to raw text
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { rawResponse: text };
      }
    }

    console.log(`[MainServer] ← ${apiType} (HTTP ${response.status})`, data);

    if (!response.ok) {
      const err = new Error(`Main server returned HTTP ${response.status}`);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      const err = new Error('Main server request timed out.');
      err.status = 504;
      throw err;
    }

    // Re-throw if it's already one of our errors
    if (error.status) throw error;

    // Network-level error
    console.error(`[MainServer] Network error for ${apiType}:`, error.message);
    const err = new Error('Could not reach the main server. Please try again later.');
    err.status = 502;
    throw err;
  }
}

// ─── Convenience Functions ────────────────────────────────

/**
 * Fetch the test catalog from the main server.
 * Returns the raw response data which should contain test list with:
 *   name, id, price, status (active / deactive)
 */
export async function fetchTestPrices() {
  return callMainServer(API_TYPES.GET_TEST_PRICE);
}

/**
 * Verify / look up report details.
 *
 * @param {string} mobile         Patient's 10-digit mobile number
 * @param {string} collectionDate Date in yyyy-MM-dd format
 * @returns {object}              { status, reportUrl, message, qrSRC, ... }
 */
export async function verifyReport(mobile, collectionDate) {
  return callMainServer(API_TYPES.VERIFY_REPORT_DETAILS, {
    mobile,
    collectionDate,
  });
}

/**
 * Forward a booking to the main server.
 *
 * @param {object} bookingData  Booking payload including prescriptionUrl, prescriptionExtension, etc.
 * @returns {object}            Main server's booking confirmation
 */
export async function sendBooking(bookingData) {
  return callMainServer(API_TYPES.SEND_BOOKING, bookingData);
}

export { API_TYPES };
