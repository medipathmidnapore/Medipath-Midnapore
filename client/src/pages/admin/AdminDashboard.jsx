import { useState, useEffect } from 'react';
import { fetchAdminBookings, fetchTests, createAdminReport } from '../../services/api';
import { Activity, ClipboardList, FlaskConical, IndianRupee, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalTests: 0,
  });

  const [reportForm, setReportForm] = useState({
    billNo: '',
    mobile: '',
    email: '',
    reportUrl: '',
    patientName: '',
  });
  const [reportStatus, setReportStatus] = useState('');

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

      const revenue = bookings.reduce((sum, b) => sum + b.amountPaid, 0);

      setStats({
        totalBookings: bookings.length,
        totalRevenue: revenue,
        totalTests: tests.length,
      });
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: <ClipboardList size={24} color="#3b82f6" />, bg: '#eff6ff' },
    { label: 'Total Revenue Collected', value: `₹${stats.totalRevenue}`, icon: <IndianRupee size={24} color="#10b981" />, bg: '#ecfdf5' },
    { label: 'Available Tests', value: stats.totalTests, icon: <FlaskConical size={24} color="#8b5cf6" />, bg: '#f5f3ff' },
  ];

  const handleReportUpload = async (e) => {
    e.preventDefault();
    setReportStatus('Uploading...');
    try {
      await createAdminReport({
        ...reportForm,
        balanceDue: 0 // Assume report is only uploaded if fully paid for this simple quick form
      });
      setReportStatus('Report Uploaded & Email Sent Successfully!');
      setReportForm({ billNo: '', mobile: '', email: '', reportUrl: '', patientName: '' });
      setTimeout(() => setReportStatus(''), 5000);
    } catch (err) {
      setReportStatus('Failed to upload report.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Welcome to the Medipath Admin Panel</p>
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
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Send size={20} color="#10b981" /> Dispatch Report</h3>
          <form onSubmit={handleReportUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="input" placeholder="Bill No *" required value={reportForm.billNo} onChange={e => setReportForm({...reportForm, billNo: e.target.value})} />
              <input className="input" placeholder="Patient Name" value={reportForm.patientName} onChange={e => setReportForm({...reportForm, patientName: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="input" placeholder="Mobile Number *" required value={reportForm.mobile} onChange={e => setReportForm({...reportForm, mobile: e.target.value})} />
              <input className="input" type="email" placeholder="Patient Email" value={reportForm.email} onChange={e => setReportForm({...reportForm, email: e.target.value})} />
            </div>
            <input className="input" placeholder="Cloudinary/Drive PDF URL *" required value={reportForm.reportUrl} onChange={e => setReportForm({...reportForm, reportUrl: e.target.value})} />
            <button type="submit" className="btn btn-primary" style={{ background: '#10b981', border: 'none' }}>Save & Email Patient</button>
            {reportStatus && <p style={{ fontSize: '0.875rem', color: reportStatus.includes('Success') ? '#10b981' : 'var(--color-error)' }}>{reportStatus}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
