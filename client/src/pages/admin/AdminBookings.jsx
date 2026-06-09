import { useState, useEffect } from 'react';
import { fetchAdminBookings } from '../../services/api';
import { Loader2, Calendar, User, Phone, MapPin } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await fetchAdminBookings();
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Home Collection Bookings</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>View and manage patient collection requests</p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {bookings.map((b) => (
            <div key={b._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-primary-50)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius)' }}>
                    {b.bookingId}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={13} /> {new Date(b.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} /> {b.patientName}
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {b.mobile1} {b.mobile2 ? `/ ${b.mobile2}` : ''}</span>
                  <span style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={14} style={{ marginTop: '0.125rem' }} /> {b.address}</span>
                </div>
              </div>

              <div style={{ background: 'var(--color-bg-alt)', padding: '1rem', borderRadius: 'var(--radius)', minWidth: '220px' }}>
                <h4 style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Tests Requested</h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
                  {b.tests.map((t, i) => (
                    <li key={i} style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t.name}</span>
                      <span style={{ fontWeight: 600 }}>₹{t.price}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Payment Mode</span>
                  <span style={{ fontWeight: 600 }}>{b.paymentMode === 'full' ? 'Full Paid' : '50% Advance'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--color-primary)' }}>₹{b.totalAmount}</span>
                </div>
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No bookings found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
