import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, FileText, ClipboardList, LogOut, FlaskConical, RefreshCw } from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Bookings', path: '/admin/bookings', icon: <ClipboardList size={18} /> },
  { label: 'Test Catalog', path: '/admin/tests', icon: <FlaskConical size={18} /> },
  { label: 'Notice Board', path: '/admin/notices', icon: <FileText size={18} /> },
  { label: 'Settings', path: '/admin/settings', icon: <ClipboardList size={18} /> },
];

export default function AdminLayout() {
  const { logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto refresh every 10 minutes (600000 ms)
  useEffect(() => {
    if (!isAdmin) return;
    const timer = setInterval(() => {
      window.location.reload();
    }, 600000);
    return () => clearInterval(timer);
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-primary)' }}>
            <FlaskConical size={24} />
            <div>
              <div style={{ fontWeight: 800, lineHeight: 1.1 }}>Medipath Admin</div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Panel</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sidebarLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  background: isActive ? 'var(--color-primary-50)' : 'transparent',
                  transition: 'all var(--transition)'
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'var(--color-bg-alt)'; e.currentTarget.style.color = 'var(--color-text)'; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; } }}
              >
                {link.icon} {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
              padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
              fontWeight: 600, color: 'var(--color-error)',
              background: 'transparent', cursor: 'pointer', border: 'none',
              transition: 'background var(--transition)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-error-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header style={{ background: 'white', borderBottom: '1px solid var(--color-border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button 
             onClick={() => window.location.reload()}
             style={{ 
               display: 'flex', alignItems: 'center', gap: '0.5rem', 
               padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600,
               background: 'white', border: '1px solid var(--color-border)',
               borderRadius: 'var(--radius)', color: 'var(--color-text)', cursor: 'pointer',
               boxShadow: '0 2px 5px rgba(0,0,0,0.02)', transition: 'background 0.2s'
             }}
             onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-alt)'}
             onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            <RefreshCw size={16} /> Refresh Data
          </button>
        </header>

        {/* Dynamic Content */}
        <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
