import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, Shield, Star } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

const quickLinks = [
  { label: 'Book Home Collection', path: '/book' },
  { label: 'Download Reports', path: '/reports' },
  { label: 'Tests & Pricing', path: '/tests' },
  { label: 'Admin Login', path: '/admin' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'var(--color-text)',
        color: 'rgba(255,255,255,0.75)',
        padding: '4rem 0 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            paddingBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <img
                src={logo}
                alt="Medipath logo"
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  objectFit: 'cover',
                  display: 'block',
                border: '2px solid white',
                }}
              />
              <div>
                <div style={{ fontWeight: 800, color: 'white', fontSize: '1.0625rem', lineHeight: 1.1 }}>Medipath</div>
                <div style={{ fontSize: '0.6875rem', opacity: 0.6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Diagnostic &amp; Consultation</div>
              </div>
            </div>

            {/* Doctors */}
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Dr. Asok Kumar Maiti &amp; Dr. Roma BasuMaiti
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8125rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Trusted pathological laboratory and healthcare clinic serving Midnapore since years. Economical rates, professional staff, hygienic facility.
            </p>

            {/* Rating */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4].map(i => (
                  <Star key={i} size={13} color="#fbbf24" fill="#fbbf24" />
                ))}
                <Star size={13} color="#fbbf24" fill="rgba(251,191,36,0.4)" />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem', fontWeight: 600 }}>4.3 · 24 Google Reviews</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.9rem',
                      transition: 'color var(--transition)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    <ArrowRight size={13} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <a
                href="tel:+919083276651"
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}
              >
                <Phone size={15} style={{ marginTop: '0.1rem', flexShrink: 0, color: '#60a5fa' }} />
                +91 90832 76651
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                <MapPin size={15} style={{ marginTop: '0.1rem', flexShrink: 0, color: '#60a5fa' }} />
                <span>
                  MITRA COMPOUND, E/52,<br />
                  Opp. Shib Mandir, Shekhpura,<br />
                  Midnapore, West Bengal 721101
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                <Clock size={15} style={{ marginTop: '0.1rem', flexShrink: 0, color: '#60a5fa' }} />
                <span>
                  Mon–Wed &amp; Fri–Sun:<br />
                  7:30 AM – 8:00 PM<br />
                  <span style={{ color: '#fca5a5', fontWeight: 600 }}>Closed on Thursdays</span>
                </span>
              </div>

              {/* Google Maps Link */}
              <a
                href="https://maps.google.com/?q=MITRA+COMPOUND+E/52+Shekhpura+Midnapore+West+Bengal+721101"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.875rem',
                  background: 'rgba(26,86,219,0.3)',
                  borderRadius: 'var(--radius)',
                  color: '#93c5fd',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: '1px solid rgba(147,197,253,0.2)',
                  marginTop: '0.25rem',
                }}
              >
                <MapPin size={13} /> Get Directions →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            © {year} Medipath Diagnostic & Consultation Centre · Dr. Asok Kumar Maiti & Dr. Roma BasuMaiti
          </p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Shekhpura, Midnapore, WB 721101
          </p>
        </div>
      </div>
    </footer>
  );
}
