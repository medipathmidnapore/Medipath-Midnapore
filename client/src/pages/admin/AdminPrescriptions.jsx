import { useState, useEffect } from 'react';
import { fetchAdminPrescriptions } from '../../services/api';
import { Loader2, FileText, User, Calendar, ExternalLink } from 'lucide-react';

export default function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      const res = await fetchAdminPrescriptions();
      setPrescriptions(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Uploaded Prescriptions</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>View prescriptions uploaded by patients for home collection</p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {prescriptions.map((b) => (
            <div key={b._id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={14} color="var(--color-text-muted)" /> {b.patientName}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> {new Date(b.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem', flex: 1 }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>📞 {b.mobileNumber}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                  Status: <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{b.status || 'Pending'}</span>
                </p>
              </div>

              <a
                href={b.prescriptionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
              >
                <ExternalLink size={14} /> View Document
              </a>
            </div>
          ))}
          {prescriptions.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
              No prescriptions uploaded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
