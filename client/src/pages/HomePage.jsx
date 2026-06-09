import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Star, Clock, Quote } from 'lucide-react';

const whyUs = [
  {
    icon: <Shield size={22} color="var(--color-primary)" />,
    title: 'Trusted & Reliable',
    desc: 'Accurate diagnostic results you can count on, managed by experienced doctors Dr. A.K. Maiti & Dr. Roma Basu Maiti.',
  },
  {
    icon: <Star size={22} color="var(--color-teal)" fill="var(--color-teal)" />,
    title: '4.3★ on Google',
    desc: 'Consistently rated highly by patients for professional staff, clean facility, and economical testing rates.',
  },
  {
    icon: <Clock size={22} color="#8b5cf6" />,
    title: 'Timely Report Delivery',
    desc: 'Get your reports on time, every time. Same-day reports available for most routine tests.',
  },
];

const reviews = [
  {
    name: 'Dharamdas Murmu',
    text: '"Very good pathology for blood and urine test... and price are very fare"',
    rating: 5,
  },
  {
    name: 'Sasanka Sekhar Sau',
    text: '"This Diagnostic center is trustful and punctual in delivery of reports."',
    rating: 5,
  },
  {
    name: 'Subhankar Dutta',
    text: '"Timely report delivery. Perfect place."',
    rating: 5,
  },
];

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
        <ServicesSection />

        {/* Why Choose Us */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-label">Why Patients Choose Us</span>
              <h2>Trusted by Midnapore Families</h2>
              <p style={{ maxWidth: '480px', margin: '1rem auto 0' }}>
                Budget-friendly rates, professional staff, and a clean hygienic facility — that's the Medipath promise.
              </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
              {whyUs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="card"
                  style={{ padding: '2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: '3rem', height: '3rem', borderRadius: 'var(--radius)',
                      background: 'var(--color-bg-alt)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.375rem' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.9rem' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Patient Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '4rem' }}
            >
              <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>
                What Patients Are Saying
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {reviews.map((review, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="card"
                    style={{ padding: '1.5rem' }}
                  >
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.875rem' }}>
                      {Array.from({ length: review.rating }).map((_, s) => (
                        <Star key={s} size={14} color="#f59e0b" fill="#f59e0b" />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                      {review.text}
                    </p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{review.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Google Review</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* High-Conversion CTA Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
