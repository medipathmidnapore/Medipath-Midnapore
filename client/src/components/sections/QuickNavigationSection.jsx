import { Link } from 'react-router-dom';
import { FileDown, FlaskConical, Home, PhoneCall } from 'lucide-react';

const quickLinks = [
  {
    title: 'Book Collection',
    desc: 'Home sample collection',
    icon: <Home size={28} color="#0369a1" />,
    path: '/book',
    bg: '#e0f2fe', // light blue
    textColor: '#0369a1',
  },
  {
    title: 'Tests & Pricing',
    desc: 'Explore all available tests',
    icon: <FlaskConical size={28} color="#15803d" />,
    path: '/tests',
    bg: '#dcfce7', // light green
    textColor: '#15803d',
  },
  {
    title: 'Download Reports',
    desc: 'Get your digital results',
    icon: <FileDown size={28} color="#9d174d" />,
    path: '/reports',
    bg: '#fce7f3', // light pink
    textColor: '#9d174d',
  },
  {
    title: 'Call Support',
    desc: '+91 90832 76651',
    icon: <PhoneCall size={28} color="#c2410c" />,
    path: 'tel:+919083276651',
    isExternal: true,
    bg: '#ffedd5', // light orange
    textColor: '#c2410c',
  },
];

export default function QuickNavigationSection() {
  return (
    <section style={{ padding: '0', marginTop: '-4rem', position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
      <div className="container">
        <div className="quick-nav-grid">
          {quickLinks.map((link, i) => {
            const content = (
              <div
                style={{
                  background: link.bg,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: link.textColor,
                  textDecoration: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {link.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 700, 
                    margin: '0 0 0.25rem 0', 
                    color: link.textColor,
                  }}>
                    {link.title}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    margin: 0, 
                    color: link.textColor,
                    opacity: 0.8,
                    fontWeight: 500,
                  }}>
                    {link.desc}
                  </p>
                </div>
              </div>
            );

            return link.isExternal ? (
              <a key={i} href={link.path} style={{ textDecoration: 'none' }}>
                {content}
              </a>
            ) : (
              <Link key={i} to={link.path} style={{ textDecoration: 'none' }}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
