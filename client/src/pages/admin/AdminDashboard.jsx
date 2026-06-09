import { useState, useEffect } from 'react';
import { fetchAdminBookings, fetchTests } from '../../services/api';
import { Activity, ClipboardList, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalTests: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsRes, testsRes] = await Promise.all([
        fetchAdminBookings(),
        fetchTests()
      ]);

      const bookings = bookingsRes.data.data;
      const tests = testsRes.data.data;

      setStats({
        totalBookings: bookings.length,
        totalTests: tests.length,
      });
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  const statCards = [
    { label: 'Total Bookings (Proxy)', value: stats.totalBookings, icon: <ClipboardList size={24} color="#3b82f6" />, bg: '#eff6ff' },
    { label: 'Available Tests', value: stats.totalTests, icon: <FlaskConical size={24} color="#8b5cf6" />, bg: '#f5f3ff' },
    { label: 'System Status', value: 'Online', icon: <Activity size={24} color="#10b981" />, bg: '#ecfdf5' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Welcome to the Medipath Proxy Admin Panel</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {statCards.map((card, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.icon}
            </div>
            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{card.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ClipboardList size={20} color="var(--color-primary)" /> Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/bookings" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>View All Bookings</Link>
            <Link to="/admin/tests" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Manage Test Catalog</Link>
            <Link to="/admin/settings" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Update Clinic Settings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
