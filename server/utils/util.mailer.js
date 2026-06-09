import nodemailer from 'nodemailer';

const CLINIC_NAME = 'Medipath Diagnostic & Consultation Centre';
const CLINIC_PHONE = '+91 90832 76651';
const CLINIC_ADDRESS = 'MITRA COMPOUND, E/52, opp. Shib Mandir, Shekhpura, Midnapore, WB 721101';
const CLINIC_HOURS = '7:30 AM – 8:00 PM (Mon–Wed & Fri–Sun) | Closed Thursdays';
const CLINIC_DOCTORS = 'Dr. A.K. Maiti & Dr. Roma Basu Maiti';

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

/**
 * Send booking confirmation email to the patient.
 */
export const sendBookingConfirmation = async ({ to, patientName, tests, totalAmount, amountPaid, balanceDue, bookingId }) => {
  const transporter = createTransporter();

  const testList = tests.map((t) => `<li>${t.name} — ₹${t.price}</li>`).join('');

  const mailOptions = {
    from: `"${CLINIC_NAME}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `✅ Booking Confirmed — ${CLINIC_NAME}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
        <div style="background: #1a56db; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 22px;">${CLINIC_NAME}</h1>
          <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 13px;">${CLINIC_DOCTORS}</p>
          <p style="color: #bfdbfe; margin: 4px 0 0; font-size: 12px;">Booking Confirmation</p>
        </div>
        <h2 style="color: #1e293b;">Hello, ${patientName}!</h2>
        <p style="color: #64748b; line-height: 1.6;">Your home collection has been confirmed. Our team will contact you shortly to confirm the time slot.</p>
        
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1a56db; margin-top: 0;">Booking Details</h3>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <h4 style="color: #1e293b;">Tests Booked:</h4>
          <ul style="color: #64748b;">${testList}</ul>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;">
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <p><strong>Amount Paid:</strong> ₹${amountPaid}</p>
          <p style="color: ${balanceDue > 0 ? '#dc2626' : '#16a34a'};"><strong>Balance Due:</strong> ₹${balanceDue}</p>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; margin: 16px 0; font-size: 13px; color: #92400e;">
          ⚠️ <strong>Note:</strong> For fasting tests (blood sugar, lipid profile), please do not eat or drink anything 10–12 hours prior to your collection.
        </div>

        <p style="color: #64748b; font-size: 14px;">📞 For queries, call us at <strong><a href="tel:+919083276651" style="color: #1a56db;">${CLINIC_PHONE}</a></strong></p>
        <p style="color: #64748b; font-size: 14px;">⏰ Hours: ${CLINIC_HOURS}</p>
        <p style="color: #64748b; font-size: 13px;">📍 ${CLINIC_ADDRESS}</p>
        
        <div style="text-align: center; margin-top: 32px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <p>${CLINIC_NAME}</p>
          <p>${CLINIC_ADDRESS}</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending booking email:', error);
    return false;
  }
};

/**
 * Send Report Ready notification email to the patient.
 */
export const sendReportNotification = async ({ to, patientName, reportUrl, billNo }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${CLINIC_NAME}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `📄 Your Test Report is Ready — ${CLINIC_NAME}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
        <div style="background: #10b981; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 22px;">${CLINIC_NAME}</h1>
          <p style="color: #ecfdf5; margin: 6px 0 0; font-size: 13px;">${CLINIC_DOCTORS}</p>
          <p style="color: #ecfdf5; margin: 4px 0 0; font-size: 12px;">Report Ready</p>
        </div>
        <h2 style="color: #1e293b;">Hello, ${patientName}!</h2>
        <p style="color: #64748b; line-height: 1.6;">Your diagnostic test report (Bill No: <strong>${billNo}</strong>) has been generated and is now ready for download.</p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${reportUrl}" target="_blank" style="background: #1a56db; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">Download Report PDF</a>
        </div>

        <p style="color: #64748b; font-size: 14px;">If the button does not work, copy and paste this link into your browser:</p>
        <p style="color: #1a56db; font-size: 12px; word-break: break-all;">${reportUrl}</p>

        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">📞 For consultation or queries, call us at <strong><a href="tel:+919083276651" style="color: #1a56db;">${CLINIC_PHONE}</a></strong></p>
        
        <div style="text-align: center; margin-top: 32px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <p>${CLINIC_NAME}</p>
          <p>${CLINIC_ADDRESS}</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Report notification email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending report email:', error);
    return false;
  }
};
