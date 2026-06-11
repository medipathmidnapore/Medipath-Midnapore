import { Link } from 'react-router-dom';
import { Home, Star, MapPin, Award, Eye, Clock } from 'lucide-react';
import doctorMale from '../../assets/doctormale.jpeg';
import doctorFemale from '../../assets/doctorfemale.jpeg';
import logo from '../../assets/logo.jpeg';

export default function HeroSection() {
  return (
    <section className="hero-wrapper">
      {/* Absolute Left Image - Dr. A.K. Maiti */}
      <div 
        className="hero-image hero-left"
        style={{
          backgroundImage: `url(${doctorMale})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
      >
        <div className="mobile-fade-bottom"></div>
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', zIndex: 2 }}>
          <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '1rem 1.5rem', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.5)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} /> Dr. Asok Kumar Maiti
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Consultant Pathologist</p>
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div className="container hero-center">
        <div style={{ 
          maxWidth: '650px', 
          margin: '0 auto', 
          textAlign: 'center',
          background: 'radial-gradient(ellipse at center, rgba(253, 253, 253, 0.95) 40%, rgba(253, 253, 253, 0.8) 70%, rgba(253, 253, 253, 0) 100%)',
          padding: '2rem 1rem',
          borderRadius: '50%'
        }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <img
              src={logo}
              alt="Medipath logo"
              style={{
                width: '5rem',
                height: '5rem',
                objectFit: 'cover',
                border: '3px solid white',
              }}
            />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: '#fff', borderRadius: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '1.5rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', border: '1px solid var(--color-border)' }}>
            <Star size={16} fill="var(--color-warning)" color="var(--color-warning)" /> Trusted Healthcare in Midnapore
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 4rem)', fontWeight: 800, lineHeight: 1.2, color: 'var(--color-text)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Precision Diagnostics.<br/>
            <span className="text-gradient-primary">Expert Vision Care.</span>
          </h1>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
            <Link to="/book" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem', fontSize: '0.9375rem', borderRadius: '3rem', boxShadow: '0 8px 20px -5px rgba(59, 130, 246, 0.4)' }}>
              <Home size={16} /> Book Home Collection
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            {/* Report Delivery Time Banner */}
            <div style={{ 
              background: 'var(--color-warning)', 
              color: 'var(--color-primary-dark)', 
              padding: '0.375rem 0.875rem', 
              borderRadius: '2rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.375rem',
              fontWeight: 700,
              fontSize: '0.75rem',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <Clock size={14} /> Standard Report Delivery: 6:00 PM
            </div>

            {/* In-House Histopathology Banner */}
            <div style={{ 
              background: 'var(--color-primary-50)', 
              border: '1px solid var(--color-primary-100)', 
              padding: '0.5rem 0.875rem', 
              borderRadius: '0.75rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              maxWidth: '100%'
            }}>
              <div style={{ background: 'var(--color-primary)', color: 'white', padding: '0.3rem', borderRadius: '50%', display: 'flex' }}>
                <Star size={13} fill="white" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '0.8125rem', lineHeight: 1.2 }}>
                  In-House Histopathology
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  All biopsies performed in-house. No outsourcing!
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            <MapPin size={16} color="var(--color-primary)" /> Shekhpura, Midnapore
          </div>

        </div>
      </div>

      {/* Absolute Right Image - Dr. Roma Basu Maiti */}
      <div 
        className="hero-image hero-right"
        style={{
          backgroundImage: `url(${doctorFemale})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
      >
        <div className="mobile-fade-top"></div>
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', zIndex: 2 }}>
          <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '1rem 1.5rem', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.5)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-teal-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={20} /> Dr. Roma Basu Maiti
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Consultant Ophthalmologist</p>
          </div>
        </div>
      </div>

    </section>
  );
}
