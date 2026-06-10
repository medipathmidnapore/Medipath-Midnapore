import { Home, FileText, FlaskConical, Zap, Shield, Clock } from 'lucide-react';

const services = [
  {
    icon: FlaskConical,
    title: 'Blood Tests',
    description: 'CBC, Lipid Profile, Thyroid, HbA1c, Vitamin D, Blood Sugar & more — accurate results at economical rates.',
    color: '#2563eb',
    bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    iconBg: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
    accent: '#2563eb',
  },
  {
    icon: FileText,
    title: 'Urine & Stool Analysis',
    description: 'Routine urine examination, microscopy, and stool tests with timely digital report delivery.',
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    iconBg: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    accent: '#7c3aed',
  },
  {
    icon: Home,
    title: 'Home Sample Collection',
    description: 'Book a home collection slot and our trained phlebotomist will collect samples from your doorstep.',
    color: '#0f766e',
    bg: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
    iconBg: 'linear-gradient(135deg, #0f766e, #065f46)',
    accent: '#0f766e',
  },
  {
    icon: Zap,
    title: 'Clinical Pathology',
    description: 'Comprehensive pathology including histopathology, cytology, and microbiological testing.',
    color: '#d97706',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    iconBg: 'linear-gradient(135deg, #d97706, #92400e)',
    accent: '#d97706',
  },
  {
    icon: Shield,
    title: 'Doctor Consultations',
    description: 'In-person consultations with Dr. A.K. Maiti & Dr. Roma Basu Maiti. New patients welcome.',
    color: '#dc2626',
    bg: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
    iconBg: 'linear-gradient(135deg, #dc2626, #991b1b)',
    accent: '#dc2626',
  },
  {
    icon: Clock,
    title: 'Open 6 Days a Week',
    description: 'Open Mon–Wed & Fri–Sun, 7:30 AM – 8:00 PM. Call us to confirm fasting test preparation.',
    color: '#059669',
    bg: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)',
    iconBg: 'linear-gradient(135deg, #059669, #065f46)',
    accent: '#059669',
  },
];

export default function ServicesSection() {
  return (
    <section className="services-section">
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

        <div className="services-grid">
          {services.map((service, i) => {
            const IconComponent = service.icon;
            return (
              <div key={i} className="service-card" style={{ '--card-accent': service.accent, '--card-bg': service.bg }}>
                <div className="service-card-inner" style={{ background: service.bg }}>
                  <div
                    className="service-icon-wrap"
                    style={{ background: service.iconBg }}
                  >
                    <IconComponent size={20} color="#ffffff" strokeWidth={2} />
                  </div>
                  <h3 className="service-title" style={{ color: service.color }}>
                    {service.title}
                  </h3>
                  <p className="service-desc">
                    {service.description}
                  </p>
                  <div className="service-card-bar" style={{ background: service.iconBg }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
