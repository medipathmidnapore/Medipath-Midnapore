import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Phone, Clock, MapPin, Menu, X, Megaphone } from 'lucide-react';
import { fetchActiveNotices } from '../../services/api';
import logo from '../../assets/logo.jpeg';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Book Collection', path: '/book' },
  { label: 'Tests & Pricing', path: '/tests' },
  { label: 'Download Reports', path: '/reports' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasNotices, setHasNotices] = useState(false);

  useEffect(() => {
    const checkNotices = async () => {
      try {
        const res = await fetchActiveNotices();
        setHasNotices(res.data.data && res.data.data.length > 0);
      } catch (err) {
        console.error(err);
      }
    };
    checkNotices();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {hasNotices && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.5rem 0', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid #fecaca' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={16} />
            <Link to="/notices" style={{ color: '#b91c1c', textDecoration: 'none' }}>
              Important Notices are available. <span style={{ textDecoration: 'underline' }}>Click here to view.</span>
            </Link>
          </div>
        </div>
      )}
      {/* Top Info Bar */}
      <div
        style={{
          background: 'var(--color-primary)',
          padding: '0.5rem 0',
          fontSize: '0.8125rem',
          color: 'rgba(255,255,255,0.9)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <MapPin size={13} />
              Shekhpura, Midnapore, West Bengal 721101
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Clock size={13} />
              Mon–Wed & Fri–Sun: 7:30 AM – 8:00 PM &nbsp;·&nbsp;
              <span style={{ color: '#fca5a5', fontWeight: 600 }}>Closed Thursdays</span>
            </span>
          </div>
          <a
            href="tel:+919083276651"
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#bfdbfe', fontWeight: 600 }}
          >
            <Phone size={13} />
            +91 90832 76651
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className="glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid var(--color-border)',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
          transition: 'box-shadow var(--transition-slow)',
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <img
              src={logo}
              alt="Medipath logo"
              style={{
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: 'var(--radius)',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.0625rem', letterSpacing: '-0.02em', color: 'var(--color-text)', lineHeight: 1.1 }}>
                Medipath
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Diagnostic &amp; Consultation
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: '0.5rem 0.875rem',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    background: isActive ? 'var(--color-primary-50)' : 'transparent',
                    transition: 'all var(--transition)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--color-bg-alt)';
                      e.currentTarget.style.color = 'var(--color-text)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            {hasNotices && (
              <Link
                to="/notices"
                style={{
                  padding: '0.5rem 0.875rem',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: location.pathname === '/notices' ? 'var(--color-primary)' : '#b91c1c',
                  transition: 'color var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem'
                }}
              >
                <Megaphone size={14} /> Notices
              </Link>
            )}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/book" className="btn btn-primary btn-sm hide-mobile">
              Book Now
            </Link>
            <button
              className="hide-desktop btn btn-ghost btn-sm"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ padding: '0.5rem' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              borderBottom: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xl)',
              padding: '1rem',
            }}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'block',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius)',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                    background: isActive ? 'var(--color-primary-50)' : 'transparent',
                    marginBottom: '0.25rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            {hasNotices && (
              <Link
                to="/notices"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  textDecoration: 'none', padding: '0.875rem 1rem',
                  color: location.pathname === '/notices' ? 'var(--color-primary)' : '#b91c1c',
                  background: location.pathname === '/notices' ? 'var(--color-primary-50)' : '#fef2f2',
                  borderRadius: 'var(--radius)',
                  fontWeight: 600,
                  marginBottom: '0.25rem',
                }}
              >
                <Megaphone size={16} /> Notice Board
              </Link>
            )}
            <div style={{ padding: '0.75rem 1rem 0' }}>
              <Link to="/book" className="btn btn-primary" style={{ width: '100%' }}>
                Book Home Collection
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
