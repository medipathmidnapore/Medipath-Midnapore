import { useState, useEffect } from 'react';
import { fetchAllNotices, createNotice, deleteNotice, toggleNotice } from '../../services/api';
import { Loader2, Plus, Trash2, Power, Clock, AlertCircle } from 'lucide-react';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    durationType: '1_week',
    customHours: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const res = await fetchAllNotices();
      setNotices(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createNotice(formData);
      setFormData({ title: '', content: '', durationType: '1_week', customHours: '' });
      setShowForm(false);
      loadNotices();
    } catch (err) {
      alert('Failed to post notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notice?')) {
      try {
        await deleteNotice(id);
        loadNotices();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleNotice(id);
      loadNotices();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const isNoticeActive = (n) => {
    if (!n.isActive) return false;
    if (n.isPermanent) return true;
    return new Date(n.expiresAt) > new Date();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Notice Board</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Post public announcements with expiration timers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Post New Notice
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create Notice</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>Notice Title</label>
              <input type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. Clinic Closed on Friday" />
            </div>
            <div>
              <label>Content</label>
              <textarea className="input" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required rows={3} placeholder="Provide details..."></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Display Duration</label>
                <select className="input" value={formData.durationType} onChange={e => setFormData({...formData, durationType: e.target.value})}>
                  <option value="1_day">1 Day</option>
                  <option value="1_week">1 Week</option>
                  <option value="forever">Forever</option>
                  <option value="custom">Custom Hours</option>
                </select>
              </div>
              {formData.durationType === 'custom' && (
                <div>
                  <label>Custom Hours</label>
                  <input type="number" min="1" className="input" value={formData.customHours} onChange={e => setFormData({...formData, customHours: e.target.value})} required placeholder="e.g. 48" />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Notice'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 size={32} className="animate-spin" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notices.map(notice => {
            const active = isNoticeActive(notice);
            return (
              <div key={notice._id} className="card" style={{ padding: '1.25rem', opacity: active ? 1 : 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem' }}>{notice.title}</h3>
                      {active ? (
                        <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '0.125rem 0.375rem', borderRadius: '4px', fontWeight: 600 }}>Active</span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '0.125rem 0.375rem', borderRadius: '4px', fontWeight: 600 }}>Expired/Disabled</span>
                      )}
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '1rem' }}>{notice.content}</p>
                    
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> Created: {new Date(notice.createdAt).toLocaleString()}</span>
                      {notice.isPermanent ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={14} /> Never Expires</span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={14} /> Expires: {new Date(notice.expiresAt).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <button onClick={() => handleToggle(notice._id)} className="btn btn-outline" style={{ padding: '0.5rem', color: notice.isActive ? 'var(--color-error)' : 'var(--color-primary)' }} title={notice.isActive ? 'Disable' : 'Enable'}>
                      <Power size={16} />
                    </button>
                    <button onClick={() => handleDelete(notice._id)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--color-error)' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {notices.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No notices found.</div>}
        </div>
      )}
    </div>
  );
}
