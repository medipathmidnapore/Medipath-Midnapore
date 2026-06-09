import { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    clinicPhone: '',
    clinicAddress: '',
    clinicHours: '',
    whatsappNumber: ''
  });
  
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    // In a real app, fetch these from an API
    setSettings({
      clinicPhone: '+91 98765 43210',
      clinicAddress: '123 Health Street, Medical District',
      clinicHours: 'Mon-Sat: 8:00 AM - 8:00 PM',
      whatsappNumber: '+91 98765 43210'
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={28} /> Clinic Settings
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Manage your proxy portal's public information.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Clinic Phone Number</label>
            <input 
              type="text" 
              className="input" 
              value={settings.clinicPhone} 
              onChange={e => setSettings({...settings, clinicPhone: e.target.value})} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>WhatsApp Number</label>
            <input 
              type="text" 
              className="input" 
              value={settings.whatsappNumber} 
              onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Working Hours</label>
            <input 
              type="text" 
              className="input" 
              value={settings.clinicHours} 
              onChange={e => setSettings({...settings, clinicHours: e.target.value})} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Clinic Address</label>
            <textarea 
              className="input" 
              rows="3"
              style={{ resize: 'vertical' }}
              value={settings.clinicAddress} 
              onChange={e => setSettings({...settings, clinicAddress: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={status === 'saving'}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {status === 'saving' ? (
              <><span className="spinner" style={{ width: '1rem', height: '1rem' }} /> Saving...</>
            ) : (
              <><Save size={18} /> Save Settings</>
            )}
          </button>

          {status === 'success' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontSize: '0.875rem' }}>
              <CheckCircle size={16} /> Settings updated successfully.
            </div>
          )}
          {status === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-error)', fontSize: '0.875rem' }}>
              <AlertCircle size={16} /> Failed to save settings.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
