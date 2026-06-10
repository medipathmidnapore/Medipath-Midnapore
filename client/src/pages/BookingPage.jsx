import { Helmet } from 'react-helmet-async';
import TestBookingWizard from '../components/TestBookingWizard';
import { Home, Clock, Shield, AlertCircle } from 'lucide-react';

export default function BookingPage() {
  return (
    <>
      <Helmet>
        <title>Book Home Collection — Medipath Diagnostic Centre, Midnapore</title>
        <meta
          name="description"
          content="Book a home sample collection from Medipath Diagnostic & Consultation Centre in Shekhpura, Midnapore. Blood tests, urine tests, pathology at budget-friendly rates. Dr. A.K. Maiti & Dr. Roma Basu Maiti."
        />
      </Helmet>

      <main>
        {/* Page Header */}
        <section style={{ background: 'white', borderBottom: '1px solid var(--color-border)', padding: '3rem 0' }}>
          <div className="container">
            <div
              style={{ maxWidth: '650px' }}
            >
              <span className="section-label">Book Appointment</span>
              <h1 style={{ marginBottom: '1rem' }}>Book Home Collection</h1>
              <p style={{ fontSize: '1.0625rem', marginBottom: '1.25rem' }}>
                Schedule your home sample collection from Medipath Diagnostic & Consultation Centre.
                Our trained staff will visit your address in Midnapore and surrounding areas.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {[
                  { icon: <Home size={15} />, text: 'Home Collection Available' },
                  { icon: <Clock size={15} />, text: '7:30 AM – 8:00 PM (Closed Thu)' },
                  { icon: <Shield size={15} />, text: 'Dr. A.K. Maiti & Dr. Roma Basu Maiti' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    <span style={{ color: 'var(--color-teal)' }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Thursday warning */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.75rem 1rem', background: '#fffbeb', borderRadius: 'var(--radius)', border: '1px solid #fde68a', fontSize: '0.875rem', color: '#92400e' }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span><strong>Note:</strong> We are closed on Thursdays. For fasting tests (blood sugar, lipid), please call <a href="tel:+919083276651" style={{ color: 'var(--color-warning)', fontWeight: 700 }}>+91 90832 76651</a> to confirm preparation rules.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Wizard */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <TestBookingWizard />
          </div>
        </section>
      </main>
    </>
  );
}
