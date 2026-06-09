import Report from '../models/model.report.js';
import { sendReportNotification } from '../utils/util.mailer.js';

/**
 * GET /api/reports/lookup
 * Looks up a report by billNo + mobile.
 * CRITICAL SECURITY: Never returns reportUrl if balanceDue > 0.
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

    const report = await Report.findOne({
      billNo: billNo.trim(),
      mobile: mobile.trim(),
    }).lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'No report found. Please check your Bill No. and mobile number.',
      });
    }

    // Security: strip report URL if payment is pending
    const responseData = {
      found: true,
      patientName: report.patientName,
      billNo: report.billNo,
      balanceDue: report.balanceDue,
      isLocked: report.balanceDue > 0,
      tests: report.tests,
    };

    if (report.balanceDue === 0 && report.reportUrl) {
      responseData.reportUrl = report.reportUrl;
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error('lookupReport error:', error);
    res.status(500).json({ success: false, message: 'Report lookup failed.' });
  }
};

/**
 * POST /api/reports
 * Admin route: Create/upload a report entry.
 */
export const createReport = async (req, res) => {
  try {
    const { billNo, serialNo, patientName, mobile, email, reportUrl, balanceDue, tests } = req.body;

    if (!billNo || !mobile) {
      return res.status(400).json({ success: false, message: 'billNo and mobile are required.' });
    }

    const report = await Report.findOneAndUpdate(
      { billNo: billNo.trim() },
      {
        billNo: billNo.trim(),
        serialNo: serialNo || '',
        patientName: patientName || '',
        mobile: mobile.trim(),
        reportUrl: reportUrl || '',
        balanceDue: Number(balanceDue) || 0,
        isLocked: Number(balanceDue) > 0,
        tests: tests || [],
      },
      { upsert: true, new: true }
    );

    // If an email and a reportUrl are provided, send the notification email
    if (email && reportUrl && Number(balanceDue) === 0) {
      sendReportNotification({
        to: email.trim(),
        patientName: patientName || 'Patient',
        reportUrl,
        billNo: billNo.trim(),
      }).catch(err => console.error('Failed to send report notification email:', err));
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('createReport error:', error);
    res.status(500).json({ success: false, message: 'Failed to create/update report.' });
  }
};
