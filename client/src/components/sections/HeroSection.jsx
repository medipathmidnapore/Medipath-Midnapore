import { Link } from 'react-router-dom';
import { Home, Star, MapPin, Award, Eye } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="hero-wrapper">
      {/* Absolute Left Image - Dr. A.K. Maiti */}
      <div 
        className="hero-image hero-left"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
      >
        <div className="mobile-fade-bottom"></div>
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', zIndex: 2 }}>
          <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '1rem 1.5rem', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.5)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} /> Dr. A.K. Maiti
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
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: '#fff', borderRadius: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '1.5rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', border: '1px solid var(--color-border)' }}>
            <Star size={16} fill="var(--color-warning)" color="var(--color-warning)" /> Trusted Healthcare in Midnapore
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, color: 'var(--color-text)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Precision Diagnostics.<br/>
            <span className="text-gradient-primary">Expert Vision Care.</span>
          </h1>

          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 auto 2.5rem auto', maxWidth: '480px', fontWeight: 500 }}>
            Medipath brings together advanced pathological testing and expert ophthalmology under one roof for complete family healthcare.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link to="/book" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderRadius: '3rem', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}>
              <Home size={20} /> Book Home Collection
            </Link>
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
          backgroundImage: 'url("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop")',
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
