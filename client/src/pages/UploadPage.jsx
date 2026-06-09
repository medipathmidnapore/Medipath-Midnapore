import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PrescriptionUpload from '../components/PrescriptionUpload';
import { Upload, Shield, Clock } from 'lucide-react';

export default function UploadPage() {
  return (
    <>
      <Helmet>
        <title>Upload Prescription — Medipath Diagnostic Centre, Midnapore</title>
        <meta
          name="description"
          content="Securely upload your doctor's prescription to Medipath Diagnostic & Consultation Centre in Shekhpura, Midnapore. Our team will review and suggest the right tests. Call +91 90832 76651."
        />
      </Helmet>

      <main>
        {/* Page Header */}
        <section style={{ background: 'white', borderBottom: '1px solid var(--color-border)', padding: '3rem 0' }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{ maxWidth: '600px' }}
            >
              <span className="section-label">Prescription Upload</span>
              <h1 style={{ marginBottom: '1rem' }}>Upload Your Prescription</h1>
              <p style={{ fontSize: '1.0625rem', marginBottom: '1.5rem' }}>
                Share your doctor's prescription with Medipath Diagnostic & Consultation Centre securely.
                Dr. A.K. Maiti or Dr. Roma Basu Maiti's team will review and guide you on the right tests.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { icon: <Shield size={15} />, text: 'Encrypted & Secure' },
                  { icon: <Upload size={15} />, text: 'JPG, PNG, PDF accepted' },
                  { icon: <Clock size={15} />, text: 'We respond within 2 hours' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    <span style={{ color: 'var(--color-teal)' }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Upload Component */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <PrescriptionUpload />
          </div>
        </section>
      </main>
    </>
  );
}
