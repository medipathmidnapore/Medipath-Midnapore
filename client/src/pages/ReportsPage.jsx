import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ReportDownload from '../components/ReportDownload';
import { FileText, Lock, Phone } from 'lucide-react';

export default function ReportsPage() {
  return (
    <>
      <Helmet>
        <title>Download Reports — Medipath Diagnostic Centre, Midnapore</title>
        <meta
          name="description"
          content="Download your diagnostic reports from Medipath Diagnostic & Consultation Centre, Shekhpura, Midnapore. Enter your Bill Number and mobile number to access your test results securely."
        />
      </Helmet>

      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--color-bg)' }}>
        <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Subtle background blob */}
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '60%', background: 'var(--color-primary)', filter: 'blur(120px)', opacity: 0.05, borderRadius: '50%', pointerEvents: 'none' }} />
          
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              
              {/* Left Column: Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <span className="section-label">Report Portal</span>
                <h1 style={{ marginBottom: '1.25rem', fontSize: '3rem', lineHeight: 1.1 }}>
                  Access Your <span className="text-gradient-primary">Reports</span> Online
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '480px', lineHeight: 1.6 }}>
                  Skip the queue. Enter your Bill Number and registered mobile number to securely view and download your diagnostic test results instantly.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { icon: <Lock size={18} />, text: 'End-to-end Secure Access', desc: 'Your health data is completely encrypted and private.' },
                    { icon: <FileText size={18} />, text: 'Instant PDF Download', desc: 'High-quality digital copies ready for your doctor.' },
                    { icon: <Phone size={18} />, text: '24/7 Support Available', desc: 'Call us at +91 90832 76651 if you need any assistance.' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.125rem' }}>{item.text}</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Column: Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                style={{ position: 'relative' }}
              >
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', width: '5rem', height: '5rem', borderTop: '4px solid var(--color-primary)', borderRight: '4px solid var(--color-primary)', borderRadius: '0 24px 0 0', opacity: 0.2 }} />
                <div style={{ position: 'absolute', bottom: '-1rem', left: '-1rem', width: '5rem', height: '5rem', borderBottom: '4px solid var(--color-teal)', borderLeft: '4px solid var(--color-teal)', borderRadius: '0 0 0 24px', opacity: 0.2 }} />
                
                {/* The Download Form Component */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <ReportDownload />
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
