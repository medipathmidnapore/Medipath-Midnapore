import { Home, FileText, FlaskConical, Zap, Shield, Clock, Microscope, TestTube, HeartPulse, Droplets } from 'lucide-react';

const services = [
  {
    icon: <FlaskConical size={26} color="var(--color-primary)" />,
    title: 'Blood Tests',
    description: 'Complete Blood Count (CBC), Lipid Profile, Thyroid, HbA1c, Vitamin D, Sugar & more. Accurate results at economical rates.',
  },
  {
    icon: <FileText size={26} color="var(--color-primary)" />,
    title: 'Urine & Stool Analysis',
    description: 'Routine urine examination, microscopy, stool tests — quick processing with timely digital report delivery.',
  },
  {
    icon: <Home size={26} color="var(--color-primary)" />,
    title: 'Home Sample Collection',
    description: 'Unable to visit? Book a home collection slot and our trained phlebotomist will collect your sample from your doorstep.',
  },
  {
    icon: <Zap size={26} color="var(--color-primary)" />,
    title: 'Clinical Pathology',
    description: 'Comprehensive clinical pathology including histopathology, cytology, and microbiological testing.',
  },
  {
    icon: <Shield size={26} color="var(--color-primary)" />,
    title: 'Doctor Consultations',
    description: 'In-person consultations with Dr. A.K. Maiti & Dr. Roma Basu Maiti. New patients welcome. Appointment recommended.',
  },
  {
    icon: <Clock size={26} color="var(--color-primary)" />,
    title: 'Open 6 Days a Week',
    description: 'Open Mon–Wed & Fri–Sun, 7:30 AM – 8:00 PM. Plan ahead for fasting tests — call us to confirm preparation rules.',
  },
];

export default function ServicesSection() {
  return (
    <section className="section" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Our Services</span>
          <h2>
            Comprehensive Diagnostics,{' '}
            <span className="text-gradient-primary">One Trusted Centre</span>
          </h2>
          <p style={{ maxWidth: '540px', margin: '1rem auto 0', fontSize: '1.0625rem' }}>
            From routine blood panels to clinical pathology and doctor consultations — all under one roof at Shekhpura, Midnapore.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {services.map((service, i) => (
            <div key={i}>
              <div
                style={{
                  display: 'block',
                  padding: '2.5rem',
                  background: '#ffffff',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    width: '4rem',
                    height: '4rem',
                    background: 'var(--color-primary-50)',
                    borderRadius: '50%',
                    border: '1px solid rgba(30, 58, 138, 0.05)',
                  }}
                >
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700, letterSpacing: '-0.01em' }}>{service.title}</h3>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: '#475569', fontWeight: 400, margin: 0 }}>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
