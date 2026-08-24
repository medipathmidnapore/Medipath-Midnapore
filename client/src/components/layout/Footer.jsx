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
                +91 9083276651 / 9083276652 / 03222-275238
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                <Phone size={15} style={{ marginTop: '0.1rem', flexShrink: 0, color: '#25D366' }} />
                <span>WhatsApp: +91 9083276651 / 9083276652</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                <MapPin size={15} style={{ marginTop: '0.1rem', flexShrink: 0, color: '#60a5fa' }} />
                <span>
                  MITRA COMPOUND, E/52,<br />
                  Near RK Honda Service Center,<br />
                  Opposite Shib Mandir, Shekhpura,<br />
                  Paschim Midnapore, West Bengal -721101
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                <Clock size={15} style={{ marginTop: '0.1rem', flexShrink: 0, color: '#60a5fa' }} />
                <span>
                  Mon–Wed &amp; Fri–Sun: 7:30 AM – 8:00 PM<br />
                  <span style={{ color: '#fca5a5', fontWeight: 600 }}>Closed on Thursdays</span>
                </span>
              </div>

              {/* Google Maps Link */}
              <a
                href="https://maps.app.goo.gl/5jJGFMCohnSF1jnx9"
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

        {/* Agency Credit Section */}
        <div className="!mt-14 !mb-8 w-full">
          <div className="!relative group rounded-2xl p-[1px] overflow-hidden bg-gradient-to-r from-white/5 via-blue-500/30 to-white/5 hover:via-blue-500/50 transition-all duration-700 !max-w-5xl !mx-auto shadow-2xl shadow-blue-500/5">
            {/* Animated shimmer effect behind the border */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            
            <div className="relative bg-[#0f172a]/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 transition-all duration-500">
              
              {/* Left Side: Agency Name & Rating */}
              <div className="flex flex-col !items-center !md:items-start text-center !md:text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-300/70 mb-2">Designed & Developed by</p>
                <a href="https://aditya-web-agency.online/" target="_blank" rel="noopener noreferrer" className="group/agency inline-flex items-center gap-4 no-underline">
                  <h3 className="font-serif !text-2xl !sm:text-3xl !font-semibold bg-gradient-to-r from-blue-200 via-white to-blue-400 bg-clip-text text-transparent transition-all duration-500 group-hover/agency:brightness-110 drop-shadow-sm">
                    Aditya Web Agency
                  </h3>
                  <div className="w-8 h-[1px] bg-blue-400/50 group-hover/agency:w-16 transition-all duration-500 hidden sm:block"></div>
                </a>
                
                {/* Google Reviews Badge */}
                <div className="!mt-5 flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full !px-4 !py-2 shadow-inner">
                  <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">Website Designer in Midnapore</span>
                  <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-400 font-bold text-sm">5.0</span>
                    <div className="flex -space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3.5 h-3.5 text-yellow-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.6)]" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Contact Info */}
              <div className="flex flex-col items-center md:items-end text-center !md:text-right !gap-4">
                <a href="tel:+919476477956" className="inline-flex !items-center !justify-center !gap-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-white rounded-full !px-6 !py-3 transition-all duration-300 group/btn shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Phone className="w-4 h-4 text-blue-400 group-hover/btn:scale-110 transition-transform" />
                  <span className="!font-semibold tracking-wider !text-sm">+91 94764 77956</span>
                </a>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 max-w-[240px] leading-relaxed">
                  Bhakat's Lodge, Khaprail Bazar, <br/>
                  Habibpur, Phadi, Midnapore 721101
                </p>
              </div>
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
            MITRA COMPOUND, E/52, Near RK Honda Service Center, Opposite Shib Mandir, Shekhpura, Paschim Midnapore, West Bengal -721101
          </p>
        </div>
      </div>
    </footer>
  );
}
