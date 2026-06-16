import { Link } from 'react-router-dom';
import { FileDown, FlaskConical, Home, PhoneCall } from 'lucide-react';

const quickLinks = [
  {
    title: 'Book Collection',
    desc: 'Home sample',
    icon: Home,
    path: '/book',
    bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    iconBg: '#0369a1',
    textColor: '#0c4a6e',
    accent: '#0369a1',
  },
  {
    title: 'Tests & Pricing',
    desc: 'Browse Tests',
    icon: FlaskConical,
    path: '/tests',
    bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    iconBg: '#15803d',
    textColor: '#14532d',
    accent: '#15803d',
  },
  {
    title: 'Download Reports',
    desc: 'Digital results',
    icon: FileDown,
    path: '/reports',
    bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    iconBg: '#9d174d',
    textColor: '#831843',
    accent: '#9d174d',
  },
  {
    title: 'Call Support',
    desc: '+91 9083276651 / 9083276652 / 03222-275238',
    icon: PhoneCall,
    path: 'tel:+919083276651',
    isExternal: true,
    bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    iconBg: '#c2410c',
    textColor: '#7c2d12',
    accent: '#c2410c',
  },
];

export default function QuickNavigationSection() {
  return (
    <section className="quick-nav-section">
      <div className="container">
        <div className="quick-nav-grid">
          {quickLinks.map((link, i) => {
            const IconComponent = link.icon;

            const content = (
              <div className="quick-nav-card" style={{ background: link.bg }}>
                <div
                  className="quick-nav-icon-wrap"
                  style={{ background: link.iconBg }}
                >
                  <IconComponent size={20} color="#ffffff" strokeWidth={2.2} />
                </div>
                <div className="quick-nav-text">
                  <h3 className="quick-nav-title" style={{ color: link.textColor }}>
                    {link.title}
                  </h3>
                  <p className="quick-nav-desc" style={{ color: link.accent }}>
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
