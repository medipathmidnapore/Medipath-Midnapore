import { motion } from 'framer-motion';
import { Home, FileText, FlaskConical, Zap, Shield, Clock, Microscope, TestTube, HeartPulse, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <FlaskConical size={28} color="var(--color-primary)" />,
    title: 'Blood Tests',
    description: 'Complete Blood Count (CBC), Lipid Profile, Thyroid, HbA1c, Vitamin D, Sugar & more. Accurate results at economical rates.',
    link: '/book',
    bg: 'var(--color-primary-50)',
  },
  {
    icon: <FileText size={28} color="var(--color-teal)" />,
    title: 'Urine & Stool Analysis',
    description: 'Routine urine examination, microscopy, stool tests — quick processing with timely digital report delivery.',
    link: '/book',
    bg: 'var(--color-teal-50)',
  },
  {
    icon: <Home size={28} color="#8b5cf6" />,
    title: 'Home Sample Collection',
    description: 'Unable to visit? Book a home collection slot and our trained phlebotomist will collect your sample from your doorstep.',
    link: '/book',
    bg: '#f5f3ff',
  },
  {
    icon: <Zap size={28} color="#f59e0b" />,
    title: 'Clinical Pathology',
    description: 'Comprehensive clinical pathology including histopathology, cytology, and microbiological testing.',
    link: '/tests',
    bg: '#fffbeb',
  },
  {
    icon: <Shield size={28} color="var(--color-success)" />,
    title: 'Doctor Consultations',
    description: 'In-person consultations with Dr. A.K. Maiti & Dr. Roma Basu Maiti. New patients welcome. Appointment recommended.',
    link: '/book',
    bg: 'var(--color-success-bg)',
  },
  {
    icon: <Clock size={28} color="#ec4899" />,
    title: 'Open 6 Days a Week',
    description: 'Open Mon–Wed & Fri–Sun, 7:30 AM – 8:00 PM. Plan ahead for fasting tests — call us to confirm preparation rules.',
    link: '/',
    bg: '#fdf2f8',
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function ServicesSection() {
  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Our Services</span>
          <h2>
            Comprehensive Diagnostics,{' '}
            <span className="text-gradient-primary">One Trusted Centre</span>
          </h2>
          <p style={{ maxWidth: '540px', margin: '1rem auto 0', fontSize: '1.0625rem' }}>
            From routine blood panels to clinical pathology and doctor consultations — all under one roof at Shekhpura, Midnapore.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link
                to={service.link}
                className="card"
                style={{
                  display: 'block',
                  padding: '2rem',
                  textDecoration: 'none',
                  transition: 'all var(--transition)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: 'var(--radius)',
                    background: service.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.625rem' }}>{service.title}</h3>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.65 }}>{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
