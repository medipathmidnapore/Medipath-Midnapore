import { useState, useEffect, useRef } from 'react';
import {
  Search, FileDown, Lock, AlertTriangle, CheckCircle, QrCode,
  Phone, Clock, Calendar, AlertCircle, ServerCrash, ShieldAlert,
  FileQuestion, ShieldCheck, KeyRound, RefreshCw,
} from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { lookupReport, verifyReportOtp } from '../services/api';

// ─── Shared Styles ────────────────────────────────────────────────────────────

const inputStyle = {
  width: '100%',
  padding: '1.125rem 1rem 1.125rem 3.5rem',
  background: 'rgba(248, 250, 252, 0.8)',
  border: '2px solid transparent',
  borderRadius: 'var(--radius-lg)',
  fontSize: '1.0625rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  transition: 'all 0.3s ease',
  outline: 'none',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
  fontFamily: 'inherit',
};

const onFocusInput = (e) => {
  e.target.style.borderColor = 'var(--color-primary)';
  e.target.style.background = '#fff';
  e.target.style.boxShadow = '0 0 0 4px rgba(26,86,219,0.1)';
  const icon = e.target.previousSibling;
  if (icon) icon.style.color = 'var(--color-primary)';
};

const onBlurInput = (e) => {
  e.target.style.borderColor = 'transparent';
  e.target.style.background = 'rgba(248, 250, 252, 0.8)';
  e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)';
  const icon = e.target.previousSibling;
  if (icon) icon.style.color = 'var(--color-text-light)';
};

// ─── Status Config ────────────────────────────────────────────────────────────

/**
 * Status code → UI configuration map for all 8 main server statuses.
 */
const STATUS_CONFIG = {
  NOT_FOUND: {
    icon: <Search size={28} />,
    iconBg: '#f1f5f9',
    iconColor: 'var(--color-text-light)',
    title: 'Report Not Found',
    borderColor: 'var(--color-border)',
    titleColor: 'var(--color-text)',
    defaultMessage:
      'No reports found matching your details. Please verify your mobile number and collection date, then try again.',
  },
  MULTIPLE_FOUND: {
    icon: <FileQuestion size={28} />,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Multiple Reports Found',
    borderColor: '#fde68a',
    titleColor: '#b45309',
    defaultMessage:
      'Multiple reports were found for your details. Please contact the Medipath reception at +91 9083276651 / 9083276652 / 03222-275238 for assistance.',
  },
  REPORT_PENDING: {
    icon: <Clock size={28} />,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Report In Progress',
    borderColor: '#fde68a',
    titleColor: '#b45309',
    defaultMessage: 'Your report is being processed. Please check back in a few hours.',
  },
  PAYMENT_PENDING: {
    icon: <Lock size={28} />,
    iconBg: 'var(--color-error-bg)',
    iconColor: 'var(--color-error)',
    title: 'Payment Due',
    borderColor: '#fecaca',
    titleColor: 'var(--color-error)',
    defaultMessage:
      'Your payment information is not updated on the system. Please contact Medipath.',
  },
  AUTH_FAIL: {
    icon: <ShieldAlert size={28} />,
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    title: 'Authentication Issue',
    borderColor: '#fecaca',
    titleColor: '#dc2626',
    defaultMessage:
      'We are experiencing a temporary authentication issue. Please try again shortly or contact reception.',
  },
  TECH_FAIL: {
    icon: <ServerCrash size={28} />,
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    title: 'Technical Error',
    borderColor: '#fecaca',
    titleColor: '#dc2626',
    defaultMessage: 'The main server encountered a technical issue. Please try again later.',
  },
  REQUEST_EMPTY: {
    icon: <AlertCircle size={28} />,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Missing Information',
    borderColor: '#fde68a',
    titleColor: '#b45309',
    defaultMessage:
      'Some required information was missing. Please check your mobile number and collection date, then try again.',
  },
};

// ─── OTP Input Component ──────────────────────────────────────────────────────

/**
 * A 6-box OTP input that auto-advances focus between digits.
 */
function OtpInput({ value, onChange, disabled }) {
  const inputsRef = useRef([]);
  const digits = value.split('');

  const handleChange = (index, char) => {
    const sanitized = char.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = sanitized;
    // Pad/trim to 4 slots
    while (newDigits.length < 4) newDigits.push('');
    onChange(newDigits.join(''));
    if (sanitized && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    onChange(pasted.padEnd(4, '').slice(0, 4));
    // Focus last filled or last box
    const lastFilled = Math.min(pasted.length, 3);
    inputsRef.current[lastFilled]?.focus();
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.625rem',
        justifyContent: 'center',
        marginBottom: '1.5rem',
      }}
    >
      {Array.from({ length: 4 }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          style={{
            width: '3rem',
            height: '3.5rem',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            border: `2px solid ${digits[i] ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius)',
            background: digits[i] ? 'rgba(26,86,219,0.05)' : 'rgba(248,250,252,0.8)',
            color: 'var(--color-text)',
            outline: 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = digits[i] ? 'var(--color-primary)' : 'var(--color-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
      ))}
    </div>
  );
}

// ─── OTP Verify Card ─────────────────────────────────────────────────────────

/**
 * Step 2 UI — shown after REPORT_READY lookup, before the URL is released.
 */
function OtpVerifyCard({ mobile, ticketId, serverMessage, onVerified, onReset }) {
  const [otp, setOtp] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('idle'); // idle | verifying | error
  const [error, setError] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  const handleVerify = async () => {
    if (otp.replace(/\D/g, '').length < 4) {
      setError('Please enter the complete 4-digit OTP.');
      return;
    }

    setVerifyStatus('verifying');
    setError('');

    try {
      const res = await verifyReportOtp({ ticketId, otp: otp.trim() });
      const reportUrl = res.data?.data?.reportUrl;
      if (reportUrl) {
        onVerified(reportUrl);
      } else {
        setError('Unexpected response from server. Please try again.');
        setVerifyStatus('error');
      }
    } catch (err) {
      const code = err.response?.data?.code;
      const remaining = err.response?.data?.attemptsRemaining ?? (attemptsRemaining - 1);
      setAttemptsRemaining(remaining);

      if (code === 'TICKET_NOT_FOUND' || code === 'TICKET_LOCKED') {
        // Session is dead — ask the user to start over
        setError(err.message || 'This OTP session has expired. Please search again.');
        setVerifyStatus('locked');
      } else {
        setError(err.message || 'Incorrect OTP. Please try again.');
        setVerifyStatus('error');
        setOtp('');
      }
    }
  };

  const isLocked = verifyStatus === 'locked';
  const isVerifying = verifyStatus === 'verifying';

  return (
    <div
      style={{
        padding: '2px',
        background: 'linear-gradient(135deg, rgba(26,86,219,0.4) 0%, rgba(20,184,166,0.4) 100%)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 40px -5px rgba(26,86,219,0.15)',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'calc(var(--radius-xl) - 2px)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal) 100%)',
            color: 'white',
            marginBottom: '1rem',
            boxShadow: '0 10px 20px -5px rgba(26,86,219,0.4)',
          }}
        >
          <ShieldCheck size={28} />
        </div>

        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--color-text)',
            margin: '0 0 0.5rem',
          }}
        >
          Enter OTP to Access Report
        </h3>

        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--color-text-muted)',
            margin: '0 0 0.5rem',
            lineHeight: 1.6,
          }}
        >
          {serverMessage ||
            'An OTP has been sent to your registered mobile number. Please enter it below to securely access your report.'}
        </p>

        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-light)',
            margin: '0 0 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
          }}
        >
          <Phone size={13} /> Sent to{' '}
          <strong style={{ color: 'var(--color-text)', letterSpacing: '0.05em' }}>
            +91 ×××× ××{mobile.slice(-4)}
          </strong>
        </p>

        {/* OTP boxes */}
        <OtpInput value={otp} onChange={setOtp} disabled={isVerifying || isLocked} />

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--color-error-bg)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-error)',
              fontSize: '0.9rem',
              fontWeight: 500,
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              textAlign: 'left',
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        {/* Verify button or Start Over button */}
        {isLocked ? (
          <button
            onClick={onReset}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={17} /> Search Again
          </button>
        ) : (
          <button
            onClick={handleVerify}
            disabled={isVerifying || otp.replace(/\D/g, '').length < 4}
            style={{
              width: '100%',
              padding: '1.125rem',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '1.125rem',
              fontWeight: 700,
              cursor: isVerifying || otp.replace(/\D/g, '').length < 4 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px -6px rgba(26,86,219,0.5)',
              fontFamily: 'inherit',
              opacity: otp.replace(/\D/g, '').length < 4 ? 0.6 : 1,
            }}
          >
            {isVerifying ? (
              <>
                <span
                  className="spinner"
                  style={{ width: '1.25rem', height: '1.25rem', borderTopColor: 'white' }}
                />
                Verifying…
              </>
            ) : (
              <>
                <KeyRound size={18} /> Verify & Access Report
              </>
            )}
          </button>
        )}

        {/* Attempt hint */}
        {!isLocked && verifyStatus === 'error' && attemptsRemaining > 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.875rem' }}>
            🔒 {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining
          </p>
        )}

        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.875rem' }}>
          ⏱ This session expires in 10 minutes
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportDownload() {
  const [mobile, setMobile] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | found | otp | verified | error
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // OTP Lockbox state
  const [ticketId, setTicketId] = useState(null);
  const [otpMessage, setOtpMessage] = useState('');
  const [verifiedReportUrl, setVerifiedReportUrl] = useState(null);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const resetToSearch = () => {
    setStatus('idle');
    setReport(null);
    setError('');
    setTicketId(null);
    setOtpMessage('');
    setVerifiedReportUrl(null);
    setCountdown(null);
  };

  // ── Lookup ────────────────────────────────────────────────────────────────────

  const fetchReportData = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setError('');
      setReport(null);
      setCountdown(null);
      setTicketId(null);
      setVerifiedReportUrl(null);
    }

    if (!mobile.trim() || mobile.trim().length < 10) {
      if (!isAutoRefresh) setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!collectionDate.trim()) {
      if (!isAutoRefresh) setError('Please select your Collection Date.');
      return;
    }
    if (!recaptchaToken) {
      if (!isAutoRefresh) setError('Please complete the CAPTCHA verification.');
      return;
    }

    if (!isAutoRefresh) setStatus('loading');

    try {
      const res = await lookupReport({
        mobile: mobile.trim(),
        collectionDate: collectionDate.trim(),
        recaptchaToken,
      });
      const fetchedReport = res.data.data;

      // ── REPORT_READY — enter OTP gate ──────────────────────────────────────
      if (fetchedReport.requiresOtp && fetchedReport.ticketId) {
        setTicketId(fetchedReport.ticketId);
        setOtpMessage(fetchedReport.message || '');
        setStatus('otp');
        return;
      }

      // ── All other statuses — show status card ──────────────────────────────
      setReport(fetchedReport);
      setStatus('found');

      if (
        fetchedReport.status === 'PAYMENT_PENDING' ||
        fetchedReport.status === 'REPORT_PENDING'
      ) {
        const waitSeconds =
          fetchedReport.qrWait && !isNaN(parseInt(fetchedReport.qrWait, 10))
            ? parseInt(fetchedReport.qrWait, 10)
            : 300;
        setCountdown(waitSeconds);
      } else {
        setCountdown(null);
      }
    } catch (err) {
      if (!isAutoRefresh) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch report. Please try again.'
        );
        setStatus('error');
      }
      setCountdown(null);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    await fetchReportData(false);
  };

  // ── OTP Verified callback ─────────────────────────────────────────────────────

  const handleOtpVerified = (url) => {
    setVerifiedReportUrl(url);
    setStatus('verified');
  };

  // ── Auto-refresh countdown ────────────────────────────────────────────────────

  useEffect(() => {
    let timerId;
    if (countdown !== null && countdown > 0) {
      timerId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      fetchReportData(true);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [countdown, mobile, collectionDate, recaptchaToken]);

  const today = new Date().toISOString().split('T')[0];

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>

      {/* ── OTP Step (replaces search form while OTP is pending) ──────────── */}
      {status === 'otp' && ticketId && (
        <OtpVerifyCard
          mobile={mobile.trim()}
          ticketId={ticketId}
          serverMessage={otpMessage}
          onVerified={handleOtpVerified}
          onReset={resetToSearch}
        />
      )}

      {/* ── Verified: show download button ────────────────────────────────── */}
      {status === 'verified' && verifiedReportUrl && (
        <div
          className="card"
          style={{
            padding: '2rem',
            textAlign: 'center',
            border: `2px solid ${STATUS_CONFIG.REPORT_PENDING ? '#bbf7d0' : 'var(--color-border)'}`,
            border: '2px solid #bbf7d0',
          }}
        >
          <div
            style={{
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '50%',
              background: 'var(--color-success-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <CheckCircle size={36} color="var(--color-success)" />
          </div>
          <h3 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>
            Identity Verified!
          </h3>
          <p style={{ marginBottom: '1.75rem', color: 'var(--color-text-muted)' }}>
            Your OTP was verified successfully. Click below to download your report.
          </p>
          <a
            href={verifiedReportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-teal btn-lg"
            style={{ display: 'inline-flex' }}
          >
            <FileDown size={20} /> Download Report
          </a>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
            🔒 Secure download from our certified servers
          </p>
          <button
            onClick={resetToSearch}
            style={{
              marginTop: '1.25rem',
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              margin: '1.25rem auto 0',
            }}
          >
            <RefreshCw size={14} /> Search another report
          </button>
        </div>
      )}

      {/* ── Search Form (shown when not in OTP/verified step) ────────────── */}
      {status !== 'otp' && status !== 'verified' && (
        <div
          style={{
            padding: '2px',
            background:
              'linear-gradient(135deg, rgba(26,86,219,0.4) 0%, rgba(20,184,166,0.4) 100%)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 40px -5px rgba(26,86,219,0.15)',
            marginBottom: '2rem',
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 'calc(var(--radius-xl) - 2px)',
              padding: '2.5rem 2rem',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal) 100%)',
                  color: 'white',
                  marginBottom: '1rem',
                  boxShadow: '0 10px 20px -5px rgba(26,86,219,0.4)',
                }}
              >
                <Search size={28} />
              </div>
              <h3
                style={{
                  fontSize: '1.625rem',
                  fontWeight: 800,
                  color: 'var(--color-text)',
                  margin: '0 0 0.25rem',
                }}
              >
                Secure Report Access
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Enter your mobile number and sample collection date
              </p>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}
            >
              {/* Mobile */}
              <div>
                <label
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Mobile Number <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '1.25rem',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-light)',
                      pointerEvents: 'none',
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <input
                    id="reportMobile"
                    type="tel"
                    placeholder="Registered Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    maxLength={10}
                    required
                    style={inputStyle}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                </div>
              </div>

              {/* Collection Date */}
              <div>
                <label
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Collection Date <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '1.25rem',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-light)',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  >
                    <Calendar size={20} />
                  </div>
                  <input
                    id="collectionDate"
                    type="date"
                    max={today}
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    required
                    style={{ ...inputStyle, paddingLeft: '3.5rem', colorScheme: 'light' }}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-light)',
                    marginTop: '0.5rem',
                    marginBottom: 0,
                    lineHeight: 1.5,
                  }}
                >
                  💡 Enter the date when your sample was collected at our centre.
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: '0.875rem 1rem',
                  background: 'var(--color-error-bg)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--color-error)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  marginBottom: '1.25rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <AlertTriangle size={18} /> {error}
              </div>
            )}

            {/* CAPTCHA */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <ReCAPTCHA
                sitekey={
                  import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                }
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                width: '100%',
                padding: '1.125rem',
                background:
                  'linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1.125rem',
                fontWeight: 700,
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px -6px rgba(26,86,219,0.5)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (status !== 'loading') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 25px -6px rgba(26,86,219,0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (status !== 'loading') {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(26,86,219,0.5)';
                }
              }}
            >
              {status === 'loading' ? (
                <>
                  <span
                    className="spinner"
                    style={{ width: '1.25rem', height: '1.25rem', borderTopColor: 'white' }}
                  />
                  Fetching Status…
                </>
              ) : (
                <>
                  Check Report Status <Search size={18} style={{ marginLeft: '0.25rem' }} />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ── Status Results (non-REPORT_READY statuses) ────────────────────── */}
      {status === 'found' && report && (
        <div>
          {/* PAYMENT_PENDING */}
          {report.status === 'PAYMENT_PENDING' && (
            <div
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                border: `2px solid ${STATUS_CONFIG.PAYMENT_PENDING.borderColor}`,
              }}
            >
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  background: STATUS_CONFIG.PAYMENT_PENDING.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Lock size={28} color={STATUS_CONFIG.PAYMENT_PENDING.iconColor} />
              </div>
              <h3 style={{ color: STATUS_CONFIG.PAYMENT_PENDING.titleColor, marginBottom: '0.5rem' }}>
                Payment Due
              </h3>
              <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                {report.message || STATUS_CONFIG.PAYMENT_PENDING.defaultMessage}
              </p>
              {report.qrSRC && (
                <div
                  style={{
                    background: 'white',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    display: 'inline-block',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      justifyContent: 'center',
                    }}
                  >
                    <QrCode size={16} color="var(--color-primary)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                      Scan to Pay
                    </span>
                  </div>
                  <img
                    src={report.qrSRC}
                    alt="Payment QR"
                    style={{ width: '180px', height: '180px', display: 'block', margin: '0 auto' }}
                  />
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#fffbeb',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #fde68a',
                  textAlign: 'left',
                }}
              >
                <Phone size={16} style={{ flexShrink: 0, marginTop: '0.1rem', color: 'var(--color-warning)' }} />
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  After payment, call the centre at{' '}
                  <a href="tel:+919083276651" style={{ color: 'var(--color-warning)', fontWeight: 700 }}>
                    +91 9083276651 / 9083276652 / 03222-275238
                  </a>{' '}
                  with your transaction details to unlock your report.
                </p>
              </div>
              {countdown !== null && countdown >= 0 && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    background: 'var(--color-primary-50)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-primary-100)',
                    color: 'var(--color-primary-dark)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Clock size={16} /> Auto-refreshing in {Math.floor(countdown / 60)}:
                  {(countdown % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          )}

          {/* All other statuses (generic card) */}
          {report.status !== 'PAYMENT_PENDING' &&
            (() => {
              const config = STATUS_CONFIG[report.status] || STATUS_CONFIG.TECH_FAIL;
              return (
                <div
                  className="card"
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    border: `2px solid ${config.borderColor}`,
                  }}
                >
                  <div
                    style={{
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '50%',
                      background: config.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                      color: config.iconColor,
                    }}
                  >
                    {config.icon}
                  </div>
                  <h3 style={{ color: config.titleColor, marginBottom: '0.5rem' }}>{config.title}</h3>
                  <p style={{ marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                    {report.message || config.defaultMessage}
                  </p>

                  {report.status === 'MULTIPLE_FOUND' && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: '#fffbeb',
                        borderRadius: 'var(--radius)',
                        border: '1px solid #fde68a',
                        textAlign: 'left',
                        marginTop: '1rem',
                      }}
                    >
                      <Phone size={16} style={{ flexShrink: 0, marginTop: '0.1rem', color: '#d97706' }} />
                      <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                        Please call the reception at{' '}
                        <a href="tel:+919083276651" style={{ color: '#d97706', fontWeight: 700 }}>
                          +91 9083276651 / 9083276652 / 03222-275238
                        </a>{' '}
                        and provide your mobile number and collection date to get your specific report.
                      </p>
                    </div>
                  )}

                  {(report.status === 'AUTH_FAIL' || report.status === 'TECH_FAIL') && (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
                      If the problem persists, please contact us at{' '}
                      <a href="tel:+919083276651" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        +91 9083276651 / 9083276652 / 03222-275238
                      </a>
                    </p>
                  )}

                  {report.status === 'REPORT_PENDING' && countdown !== null && countdown >= 0 && (
                    <div
                      style={{
                        marginTop: '1.5rem',
                        background: 'var(--color-primary-50)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--color-primary-100)',
                        color: 'var(--color-primary-dark)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Clock size={16} /> Auto-refreshing in {Math.floor(countdown / 60)}:
                      {(countdown % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              );
            })()}
        </div>
      )}
    </div>
  );
}
