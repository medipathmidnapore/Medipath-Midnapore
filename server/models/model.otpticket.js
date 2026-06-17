import mongoose from 'mongoose';

/**
 * OtpTicket — Temporary Lockbox Document
 *
 * Lifecycle:
 *  1. Created when Main Server responds with REPORT_READY (contains otp + reportUrl).
 *  2. The ticketId is sent to the frontend. The otp & reportUrl stay on the server.
 *  3. On successful OTP verification, the document is deleted (one-time use).
 *  4. MongoDB auto-deletes unverified tickets after OTP_TTL_SECONDS (safety net).
 *
 * Security:
 *  - otp and reportUrl are NEVER sent to the client.
 *  - Each ticket is single-use and time-limited.
 *  - Max 3 wrong attempts before the ticket is permanently locked.
 */

const OTP_TTL_SECONDS = 10 * 60; // 10 minutes

const otpTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    reportUrl: {
      type: String,
      required: true,
    },
    // Mirror of the main server status/message — for context on verify response
    status: {
      type: String,
      default: 'REPORT_READY',
    },
    message: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    // Attempt counter — locked after MAX_ATTEMPTS wrong tries
    attempts: {
      type: Number,
      default: 0,
    },
    // TTL index: MongoDB auto-deletes this document after OTP_TTL_SECONDS
    createdAt: {
      type: Date,
      default: Date.now,
      expires: OTP_TTL_SECONDS,
    },
  }
);

const OtpTicket = mongoose.model('OtpTicket', otpTicketSchema);
export default OtpTicket;
