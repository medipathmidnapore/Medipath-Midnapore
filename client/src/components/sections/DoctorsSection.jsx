import { Award, GraduationCap, CheckCircle2 } from 'lucide-react';
import doctorMale from '../../assets/doctormale.jpeg';
import doctorFemale from '../../assets/doctorfemale.jpeg';

const doctors = [
  {
    name: 'Dr. Asok Kumar Maiti',
    qualifications: 'MBBS, MD (Path)',
    specialty: 'Consultant Pathologist',
    experience: '35+ Years Experience',
    description: 'Ex-Pathologist, Cancer Detection Centre, District Hospital (presently Midnapur Medical College). Consultant Pathologist, B.C. Roy Technology Hospital, IIT Kharagpur. Author of more than 12 publications in national and international journals.',
    highlights: ['Cancer Detection', 'Histopathology', 'Clinical Pathology'],
    photo: doctorMale,
  },
  {
    name: 'Dr. Roma Basu Maiti',
    qualifications: 'MBBS, DOMS, MS (Ophthalmology)',
    specialty: 'Consultant Ophthalmologist',
    experience: '30+ Years Experience',
    description: 'Ex-Eye Surgeon, Midnapur Medical College & Hospital. Highly experienced ophthalmologist dedicated to preserving and restoring vision with precision and compassionate care.',
    highlights: ['Eye Surgery', 'Ophthalmology', 'Vision Care'],
    photo: doctorFemale,
  }
];

export default function DoctorsSection() {
  return (
    <section className="section" style={{ background: 'white', padding: '6rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ display: 'inline-block', padding: '0.375rem 1rem', background: 'var(--color-primary-50)', color: 'var(--color-primary-dark)', borderRadius: '2rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            Our Medical Experts
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>Meet Our Doctors</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.6 }}>
            Led by experienced and highly qualified medical professionals, we are committed to providing the best healthcare and diagnostic services.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {doctors.map((doctor, i) => (
            <div
              key={i}
              style={{
                background: 'var(--color-bg)',
                borderRadius: '2rem',
                overflow: 'hidden',
                boxShadow: '0 15px 30px -10px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ height: '520px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Doctor' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, var(--color-bg), transparent)' }}></div>
              </div>
              
              <div style={{ padding: '0 2.5rem 2.5rem 2.5rem', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'white',
                  color: 'var(--color-primary)',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '2rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '1.5rem',
                  alignSelf: 'flex-start',
                  marginTop: '-1.25rem',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <Award size={16} /> {doctor.experience}
                </div>
                
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-text)', fontWeight: 800 }}>{doctor.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-teal)', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>
                  <GraduationCap size={20} /> {doctor.qualifications}
                </div>
                
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '2rem', flex: 1, fontSize: '1.0625rem', fontWeight: 500 }}>
                  {doctor.description}
                </p>
                
                <div style={{ borderTop: '2px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Focus Areas</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {doctor.highlights.map((highlight, j) => (
                      <span key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 600, background: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', color: 'var(--color-text-muted)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)' }}>
                        <CheckCircle2 size={14} color="var(--color-primary)" /> {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
