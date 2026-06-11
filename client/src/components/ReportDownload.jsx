import { useState } from 'react';
import { Search, FileDown, Lock, AlertTriangle, CheckCircle, QrCode, Phone, FileText, Clock, Calendar, Hash } from 'lucide-react';
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

export default function ReportDownload() {
  const [mobile, setMobile] = useState('');
  // 'bill' | 'date' — which identifier the patient is using
  const [identifierType, setIdentifierType] = useState('bill');
  const [billNo, setBillNo] = useState('');
  const [collectionDate, setCollectionDate] = useState('');

  const [status, setStatus] = useState('idle'); // idle | loading | found | not_found | error
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setReport(null);

    // Validate mobile
    if (!mobile.trim() || mobile.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Validate identifier
    if (identifierType === 'bill' && !billNo.trim()) {
      setError('Please enter your Bill Number.');
      return;
    }
    if (identifierType === 'date' && !collectionDate.trim()) {
      setError('Please select your Collection Date.');
      return;
    }

    setStatus('loading');

    const params = { mobile: mobile.trim() };
    if (identifierType === 'bill') {
      params.billNo = billNo.trim();
    } else {
      params.collectionDate = collectionDate.trim();
    }

    try {
      const res = await lookupReport(params);
      setReport(res.data.data);
      setStatus('found');
    } catch (err) {
      if (err.response?.status === 404 || err.message?.includes('No report found')) {
        setStatus('not_found');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch report. Please try again.');
        setStatus('error');
      }
    }
  };

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
              Retrieve your diagnostic report instantly
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>

            {/* ── Mobile (always required) ── */}
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

            {/* ── Identifier toggle ── */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.625rem' }}>
                Verify With <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>

              {/* Toggle pills */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  background: 'rgba(241,245,249,0.9)',
                  borderRadius: 'var(--radius-md)',
                  padding: '4px',
                  marginBottom: '1rem',
                }}
              >
                {[
                  { key: 'bill', label: 'Bill Number', icon: <Hash size={15} /> },
                  { key: 'date', label: 'Collection Date', icon: <Calendar size={15} /> },
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setIdentifierType(key); setError(''); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.625rem 0.5rem',
                      borderRadius: 'calc(var(--radius-md) - 4px)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease',
                      background: identifierType === key
                        ? 'white'
                        : 'transparent',
                      color: identifierType === key
                        ? 'var(--color-primary)'
                        : 'var(--color-text-muted)',
                      boxShadow: identifierType === key
                        ? '0 2px 8px rgba(0,0,0,0.1)'
                        : 'none',
                    }}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* Bill Number input */}
              {identifierType === 'bill' && (
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '1.25rem', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }}>
                    <FileText size={20} />
                  </div>
                  <input
                    id="billNo"
                    type="text"
                    placeholder="Bill No. (e.g. MED-00123)"
                    value={billNo}
                    onChange={(e) => setBillNo(e.target.value)}
                    style={inputStyle}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                </div>
              )}

              {/* Collection Date input */}
              {identifierType === 'date' && (
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
                    style={{ ...inputStyle, paddingLeft: '3.5rem', colorScheme: 'light' }}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                </div>
              )}

              {/* Helper hint */}
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.5rem', marginBottom: 0, lineHeight: 1.5 }}>
                {identifierType === 'bill'
                  ? '💡 Your Bill Number is printed on your receipt or payment slip.'
                  : '💡 Enter the date when your sample was collected at our centre.'}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '0.875rem 1rem', background: 'var(--color-error-bg)', borderRadius: 'var(--radius)', color: 'var(--color-error)', fontSize: '0.9375rem', fontWeight: 500, marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <AlertTriangle size={18} /> {error}
            </div>
          )}

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
      <>
        {status === 'not_found' && (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <Search size={36} style={{ margin: '0 auto 1rem', color: 'var(--color-text-light)' }} />
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text)' }}>Report Not Found</h3>
            <p style={{ fontSize: '0.9375rem' }}>
              We couldn't find a report matching your details. Please double-check your{' '}
              {identifierType === 'bill' ? 'Bill Number' : 'Collection Date'} and mobile number, then try again.
            </p>
          </div>
        )}

        {status === 'found' && report && (
          <div>
            {/* WAIT NORMAL */}
            {report.status === 'wait_normal' && (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '2px solid #fde68a' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Clock size={28} color="#d97706" />
                </div>
                <h3 style={{ color: '#b45309', marginBottom: '0.5rem' }}>Processing</h3>
                <p style={{ marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                  {report.message || 'Your report is still being processed. Please check back later.'}
                </p>
              </div>
            )}

            {/* WAIT PAYMENT */}
            {report.status === 'wait_payment' && (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '2px solid #fecaca' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--color-error-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Lock size={28} color="var(--color-error)" />
                </div>
                <h3 style={{ color: 'var(--color-error)', marginBottom: '0.5rem' }}>Payment Due</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                  Your report is ready but requires payment to unlock.
                </p>
                {report.qrSrc && (
                  <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'inline-block', marginBottom: '1.25rem' }}>
                    <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                      <QrCode size={16} color="var(--color-primary)" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>Scan to Pay</span>
                    </div>
                    <img src={report.qrSrc} alt="Payment QR" style={{ width: '180px', height: '180px', display: 'block', margin: '0 auto' }} />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: '#fffbeb', borderRadius: 'var(--radius)', border: '1px solid #fde68a', textAlign: 'left' }}>
                  <Phone size={16} style={{ flexShrink: 0, marginTop: '0.1rem', color: 'var(--color-warning)' }} />
                  <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                    After payment, call the clinic at{' '}
                    <a href={`tel:${report.phone || '+919083276651'}`} style={{ color: 'var(--color-warning)', fontWeight: 700 }}>
                      {report.phone || '+91 90832 76651'}
                    </a>{' '}
                    with your transaction details to unlock your report.
                  </p>
                </div>
              </div>
            )}

            {/* READY */}
            {report.status === 'ready' && (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '2px solid #bbf7d0' }}>
                <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <CheckCircle size={36} color="var(--color-success)" />
                </div>
                <h3 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>Report Ready!</h3>
                <p style={{ marginBottom: '1.75rem' }}>
                  Your diagnostic report is ready. Click below to download it securely.
                </p>
                <a
                  href={report.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-teal btn-lg"
                  style={{ display: 'inline-flex' }}
                >
                  <FileDown size={20} /> Download PDF Report
                </a>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
                  🔒 Secure download from our certified servers
                </p>
              </div>
            )}
          </div>
        )}
      </>
    </div>
  );
}
