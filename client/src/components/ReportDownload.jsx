import { useState, useEffect } from 'react';
import { Search, FileDown, Lock, AlertTriangle, CheckCircle, QrCode, Phone, Clock, Calendar, AlertCircle, ServerCrash, ShieldAlert, FileQuestion } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { lookupReport } from '../services/api';

// Shared input style factory
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
    defaultMessage: 'No reports found matching your details. Please verify your mobile number and collection date, then try again.',
  },
  MULTIPLE_FOUND: {
    icon: <FileQuestion size={28} />,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Multiple Reports Found',
    borderColor: '#fde68a',
    titleColor: '#b45309',
    defaultMessage: 'Multiple reports were found for your details. Please contact the Medipath reception at +91 9083276651 / 9083276652 / 03222-275238 for assistance.',
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
    defaultMessage: 'Your payment information is not updated on the system. Please contact Medipath.',
  },
  REPORT_READY: {
    icon: <CheckCircle size={36} />,
    iconBg: 'var(--color-success-bg)',
    iconColor: 'var(--color-success)',
    title: 'Report Ready!',
    borderColor: '#bbf7d0',
    titleColor: 'var(--color-success)',
    defaultMessage: 'Your diagnostic report is ready. Click below to download it securely.',
  },
  AUTH_FAIL: {
    icon: <ShieldAlert size={28} />,
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    title: 'Authentication Issue',
    borderColor: '#fecaca',
    titleColor: '#dc2626',
    defaultMessage: 'We are experiencing a temporary authentication issue. Please try again shortly or contact reception.',
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
    defaultMessage: 'Some required information was missing. Please check your mobile number and collection date, then try again.',
  },
};

export default function ReportDownload() {
  const [mobile, setMobile] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | found | error
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const fetchReportData = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setError('');
      setReport(null);
      setCountdown(null);
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
      setReport(fetchedReport);
      setStatus('found');

      if (fetchedReport.status === 'PAYMENT_PENDING' || fetchedReport.status === 'REPORT_PENDING') {
        const waitSeconds = fetchedReport.qrWait && !isNaN(parseInt(fetchedReport.qrWait, 10)) 
          ? parseInt(fetchedReport.qrWait, 10) 
          : 300;
        setCountdown(waitSeconds);
      } else {
        setCountdown(null);
      }
    } catch (err) {
      if (!isAutoRefresh) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch report. Please try again.');
        setStatus('error');
      }
      setCountdown(null);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    await fetchReportData(false);
  };

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

  // Today's date for max attribute on date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      {/* Search form card */}
      <div
        style={{
          padding: '2px',
          background: 'linear-gradient(135deg, rgba(26,86,219,0.4) 0%, rgba(20,184,166,0.4) 100%)',
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
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '4rem', height: '4rem', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal) 100%)',
                color: 'white', marginBottom: '1rem',
                boxShadow: '0 10px 20px -5px rgba(26,86,219,0.4)',
              }}
            >
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.25rem' }}>
              Secure Report Access
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Enter your mobile number and sample collection date
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>

            {/* ── Mobile (required) ── */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Mobile Number <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1.25rem', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }}>
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

            {/* ── Collection Date (required) ── */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Collection Date <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1.25rem', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none', zIndex: 1 }}>
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
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.5rem', marginBottom: 0, lineHeight: 1.5 }}>
                💡 Enter the date when your sample was collected at our centre.
              </p>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.875rem 1rem', background: 'var(--color-error-bg)', borderRadius: 'var(--radius)', color: 'var(--color-error)', fontSize: '0.9375rem', fontWeight: 500, marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <AlertTriangle size={18} /> {error}
            </div>
          )}

          {/* CAPTCHA Verification */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
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
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal) 100%)',
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
            onMouseEnter={(e) => { if (status !== 'loading') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 25px -6px rgba(26,86,219,0.6)'; }}}
            onMouseLeave={(e) => { if (status !== 'loading') { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(26,86,219,0.5)'; }}}
          >
            {status === 'loading' ? (
              <><span className="spinner" style={{ width: '1.25rem', height: '1.25rem', borderTopColor: 'white' }} /> Fetching Status…</>
            ) : (
              <>Check Report Status <Search size={18} style={{ marginLeft: '0.25rem' }} /></>
            )}
          </button>
        </form>
      </div>

      {/* ── Results ── */}
      {status === 'found' && report && (
        <div>
          {/* REPORT_READY — special handling with download button */}
          {report.status === 'REPORT_READY' && (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', border: `2px solid ${STATUS_CONFIG.REPORT_READY.borderColor}` }}>
              <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', background: STATUS_CONFIG.REPORT_READY.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle size={36} color={STATUS_CONFIG.REPORT_READY.iconColor} />
              </div>
              <h3 style={{ color: STATUS_CONFIG.REPORT_READY.titleColor, marginBottom: '0.5rem' }}>Report Ready!</h3>
              <p style={{ marginBottom: '1.75rem' }}>
                {report.message || STATUS_CONFIG.REPORT_READY.defaultMessage}
              </p>
              {report.reportUrl && (
                <a
                  href={report.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-teal btn-lg"
                  style={{ display: 'inline-flex' }}
                >
                  <FileDown size={20} /> Download Report
                </a>
              )}
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
                🔒 Secure download from our certified servers
              </p>
            </div>
          )}

          {/* PAYMENT_PENDING — special handling with QR code */}
          {report.status === 'PAYMENT_PENDING' && (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', border: `2px solid ${STATUS_CONFIG.PAYMENT_PENDING.borderColor}` }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: STATUS_CONFIG.PAYMENT_PENDING.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Lock size={28} color={STATUS_CONFIG.PAYMENT_PENDING.iconColor} />
              </div>
              <h3 style={{ color: STATUS_CONFIG.PAYMENT_PENDING.titleColor, marginBottom: '0.5rem' }}>Payment Due</h3>
              <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                {report.message || STATUS_CONFIG.PAYMENT_PENDING.defaultMessage}
              </p>
              {report.qrSRC && (
                <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'inline-block', marginBottom: '1.25rem' }}>
                  <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <QrCode size={16} color="var(--color-primary)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>Scan to Pay</span>
                  </div>
                  <img src={report.qrSRC} alt="Payment QR" style={{ width: '180px', height: '180px', display: 'block', margin: '0 auto' }} />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: '#fffbeb', borderRadius: 'var(--radius)', border: '1px solid #fde68a', textAlign: 'left' }}>
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
                <div style={{ marginTop: '1.5rem', background: 'var(--color-primary-50)', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--color-primary-100)', color: 'var(--color-primary-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Clock size={16} /> Auto-refreshing in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          )}

          {/* All other statuses — generic card renderer */}
          {report.status !== 'REPORT_READY' && report.status !== 'PAYMENT_PENDING' && (() => {
            const config = STATUS_CONFIG[report.status] || STATUS_CONFIG.TECH_FAIL;
            return (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', border: `2px solid ${config.borderColor}` }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: config.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: config.iconColor }}>
                  {config.icon}
                </div>
                <h3 style={{ color: config.titleColor, marginBottom: '0.5rem' }}>{config.title}</h3>
                <p style={{ marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                  {report.message || config.defaultMessage}
                </p>
                {/* For MULTIPLE_FOUND — show contact info */}
                {report.status === 'MULTIPLE_FOUND' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: '#fffbeb', borderRadius: 'var(--radius)', border: '1px solid #fde68a', textAlign: 'left', marginTop: '1rem' }}>
                    <Phone size={16} style={{ flexShrink: 0, marginTop: '0.1rem', color: '#d97706' }} />
                    <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                      Please call the reception at{' '}
                      <a href="tel:+919083276651" style={{ color: '#d97706', fontWeight: 700 }}>+91 9083276651 / 9083276652 / 03222-275238</a>{' '}
                      and provide your mobile number and collection date to get your specific report.
                    </p>
                  </div>
                )}
                {/* For AUTH_FAIL / TECH_FAIL — show retry suggestion */}
                {(report.status === 'AUTH_FAIL' || report.status === 'TECH_FAIL') && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
                    If the problem persists, please contact us at{' '}
                    <a href="tel:+919083276651" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>+91 9083276651 / 9083276652 / 03222-275238</a>
                  </p>
                )}
                {report.status === 'REPORT_PENDING' && countdown !== null && countdown >= 0 && (
                  <div style={{ marginTop: '1.5rem', background: 'var(--color-primary-50)', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--color-primary-100)', color: 'var(--color-primary-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Clock size={16} /> Auto-refreshing in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
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
