import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileDown, FlaskConical, Clock, Star, MapPin, Phone, ArrowRight } from 'lucide-react';
// Using the newly uploaded doctorphoto.jpg
import heroImage from '../../assets/doctorphoto.jpg';

const stats = [
  { value: '4.3★', label: '24 Google Reviews' },
  { value: '200+', label: 'Tests Available' },
  { value: 'Same Day', label: 'Report Delivery' },
  { value: 'Budget', label: 'Friendly Rates' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
    <section style={{ minHeight: 'calc(100vh - 4rem)', display: 'flex', alignItems: 'center', background: 'var(--color-bg)', padding: '4rem 0', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Blur Backgrounds */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'var(--color-primary-50)', filter: 'blur(100px)', zIndex: 0, opacity: 0.7 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'var(--color-teal-50)', filter: 'blur(100px)', zIndex: 0, opacity: 0.7 }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Content */}
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.15 }}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', borderRadius: '2rem', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
              <Star size={14} fill="currentColor" /> Trusted Pathological Lab in Midnapore
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, color: 'var(--color-text)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Precision in <br/>
              <span style={{ color: 'var(--color-primary)' }}>Diagnostics,</span><br/>
              Care in Healing.
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '480px', marginBottom: '2.5rem' }}>
              Medipath Diagnostic & Consultation Centre provides reliable testing and expert medical consultations led by Dr. A.K. Maiti & Dr. Roma Basu Maiti.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link to="/book" className="btn btn-primary" style={{ padding: '0.875rem 1.5rem', fontSize: '1rem', borderRadius: '2rem' }}>
                <Home size={18} /> Book Home Collection
              </Link>
              <Link to="/reports" className="btn btn-outline" style={{ padding: '0.875rem 1.5rem', fontSize: '1rem', borderRadius: '2rem', background: 'white' }}>
                <FileDown size={18} /> Download Reports
              </Link>
            </motion.div>

            {/* Quick Info Grid */}
            <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <MapPin size={16} color="var(--color-primary)" /> Location
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Shekhpura, Midnapore<br/>West Bengal 721101</p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <Clock size={16} color="var(--color-primary)" /> Hours
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>7:30 AM – 8:00 PM<br/>(Closed Thursdays)</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image/Graphic Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          >
            {/* Elegant Image Container */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', aspectRatio: '4/5', borderRadius: '2rem', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '8px solid white' }}>
              <img 
                src={heroImage} 
                alt="Dr. A.K. Maiti and Dr. Roma Basu Maiti"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x625?text=Doctor+Photo';
                }}
              />
              
              {/* Floating Stat Badge */}
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ width: '3rem', height: '3rem', background: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FlaskConical size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text)' }}>200+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Tests Available</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
