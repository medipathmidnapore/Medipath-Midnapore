import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/sections/HeroSection';
import QuickNavigationSection from '../components/sections/QuickNavigationSection';
import TestSearchSection from '../components/sections/TestSearchSection';
import DoctorsSection from '../components/sections/DoctorsSection';
import ServicesSection from '../components/sections/ServicesSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Star, Clock } from 'lucide-react';



export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Medipath Diagnostic & Consultation Centre — Pathological Lab in Midnapore, West Bengal</title>
        <meta
          name="description"
          content="Medipath Diagnostic & Consultation Centre — trusted pathological laboratory in Shekhpura, Midnapore (WB 721101). Blood tests, urine tests, clinical pathology & doctor consultations by Dr. A.K. Maiti & Dr. Roma Basu Maiti. Call +91 90832 76651."
        />
        <meta property="og:title" content="Medipath Diagnostic & Consultation Centre — Midnapore" />
        <meta property="og:description" content="Trusted pathological lab in Shekhpura, Midnapore. Budget-friendly blood tests, urine tests, clinical pathology & doctor consultations. 4.3★ on Google." />
        <meta name="keywords" content="medipath diagnostics midnapore, pathological lab midnapore, blood test midnapore, diagnostic centre shekhpura, dr ak maiti midnapore, medipath shekhpura" />
      </Helmet>

      <main>
        <HeroSection />
        <QuickNavigationSection />
        <TestSearchSection />
        <DoctorsSection />
        <ServicesSection />

        <TestimonialsSection />

        {/* Why Choose Us / CTA */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">

            {/* High-Conversion CTA Banner */}
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #1e3a8a 100%)',
                borderRadius: 'var(--radius-xl)',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-2xl)',
                marginTop: '2rem'
              }}
            >
              {/* Decorative elements */}
              <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>

              <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
                <span style={{ display: 'inline-block', padding: '0.375rem 1rem', background: 'rgba(255,255,255,0.1)', color: '#bfdbfe', borderRadius: '2rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', backdropFilter: 'blur(4px)' }}>
                  Prioritize Your Well-being
                </span>
                
                <h2 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 2.75rem)', lineHeight: 1.1, fontWeight: 800, marginBottom: '1.25rem' }}>
                  Don't compromise on accuracy. <br/>
                  <span style={{ color: '#93c5fd' }}>Book your tests today.</span>
                </h2>
                
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                  Experience seamless healthcare. From easy home sample collection to rapid digital reports—we ensure precision at every step.
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link
                    to="/book"
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      background: 'white', color: 'var(--color-primary-dark)',
                      padding: '1rem 2rem', borderRadius: '3rem',
                      fontWeight: 700, fontSize: '1.125rem',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                      transition: 'transform 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Book Home Collection <ArrowRight size={20} />
                  </Link>
                  
                  <a
                    href="tel:+919083276651"
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      color: 'white', padding: '1rem 1.5rem',
                      borderRadius: '3rem', border: '1px solid rgba(255,255,255,0.3)',
                      fontWeight: 600, fontSize: '1rem',
                      backdropFilter: 'blur(10px)',
                      transition: 'background 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Call Us Now
                  </a>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', color: '#bfdbfe', fontSize: '0.875rem', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={16} /> 100% Accurate
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} /> Fast Delivery
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={16} /> Highly Rated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
