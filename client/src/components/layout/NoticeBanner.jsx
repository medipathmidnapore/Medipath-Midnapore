import { useState, useEffect } from 'react';
import { fetchActiveNotices } from '../../services/api';
import { X, AlertCircle, Info } from 'lucide-react';

export default function NoticeBanner() {
  const [notices, setNotices] = useState([]);
  const [dismissedImportant, setDismissedImportant] = useState({});

  useEffect(() => {
    // Fetch active notices
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const res = await fetchActiveNotices();
      if (res.data && res.data.success) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    }
  };

  const handleDismissImportant = (noticeId) => {
    const updated = { ...dismissedImportant, [noticeId]: true };
    setDismissedImportant(updated);
  };

  const activeImportantNotices = notices.filter(
    (n) => n.type === 'important' && !dismissedImportant[n._id]
  );
  
  const activeNominalNotices = notices.filter(
    (n) => n.type === 'nominal' || !n.type // fallback for old notices
  );

  return (
    <>
      {/* Nominal Notices - Sticky Top Bar */}
      {activeNominalNotices.length > 0 && (
        <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }}>
          {activeNominalNotices.map((notice) => (
            <div
              key={notice._id}
              style={{
                background: 'var(--color-primary-50)',
                borderBottom: '1px solid var(--color-primary-100)',
                padding: '0.75rem 1rem',
                textAlign: 'center',
                color: 'var(--color-primary)',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 500
              }}
            >
              <Info size={16} />
              <span>
                <strong>{notice.title}:</strong> {notice.content}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Important Notices - Modal Overlay */}
      {activeImportantNotices.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          {/* Only show the first important notice to prevent overwhelming the user */}
          <div
            className="card"
            style={{
              maxWidth: '500px',
              width: '100%',
              background: 'white',
              position: 'relative',
              overflow: 'hidden',
              animation: 'fadeInUp 0.3s ease-out forwards'
            }}
          >
            {/* Red Top Border Accent */}
            <div style={{ height: '4px', background: 'var(--color-error)' }} />
            
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--color-error-bg)', padding: '0.75rem', borderRadius: '50%', color: 'var(--color-error)' }}>
                  <AlertCircle size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '0.25rem', marginTop: '0.25rem' }}>
                    {activeImportantNotices[0].title}
                  </h2>
                </div>
              </div>
              
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {activeImportantNotices[0].content}
              </p>
              
              <button
                className="btn btn-outline"
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                onClick={() => handleDismissImportant(activeImportantNotices[0]._id)}
              >
                Close & Continue
              </button>
            </div>
            
            {/* Top Right Close Button */}
            <button
              onClick={() => handleDismissImportant(activeImportantNotices[0]._id)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-alt)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
