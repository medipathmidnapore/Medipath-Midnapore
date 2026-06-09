import { useState, useEffect } from 'react';
import { fetchActiveNotices } from '../services/api';
import { Helmet } from 'react-helmet-async';
import { Megaphone, Calendar, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const res = await fetchActiveNotices();
        setNotices(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNotices();
  }, []);

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 80px)', padding: '4rem 1rem' }}>
      <Helmet>
        <title>Notice Board | Medipath Diagnostics</title>
        <meta name="description" content="Important announcements and notices from Medipath Diagnostics." />
      </Helmet>

      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: 'var(--color-primary-50)', borderRadius: '50%', color: 'var(--color-primary)', marginBottom: '1rem' }}>
            <Megaphone size={32} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Notice Board</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Important announcements and updates from our clinic</p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
          </div>
        ) : notices.length === 0 ? (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
            <Megaphone size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-border)' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>No active notices at this time.</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {notices.map((notice, index) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card card-hover"
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-lg)',
                  borderLeft: '4px solid var(--color-primary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
                    {notice.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-alt)', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>
                    <Calendar size={14} />
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>
                  {notice.content}
                </p>

                {(!notice.isPermanent && notice.expiresAt) && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>
                    <Clock size={14} />
                    <span>Valid until {new Date(notice.expiresAt).toLocaleString()}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
