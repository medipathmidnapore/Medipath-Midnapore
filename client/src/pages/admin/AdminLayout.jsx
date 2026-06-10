import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, FileText, ClipboardList, LogOut, FlaskConical, RefreshCw, Menu, X, Settings } from 'lucide-react';

const navLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Bookings',  path: '/admin/bookings',  icon: ClipboardList },
  { label: 'Tests',     path: '/admin/tests',      icon: FlaskConical },
  { label: 'Notices',   path: '/admin/notices',    icon: FileText },
  { label: 'Settings',  path: '/admin/settings',   icon: Settings },
];

export default function AdminLayout() {
  const { logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto refresh every 10 minutes
  useEffect(() => {
    if (!isAdmin) return;
    const timer = setInterval(() => window.location.reload(), 600000);
    return () => clearInterval(timer);
  }, [isAdmin]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const currentPage = navLinks.find(l => location.pathname.startsWith(l.path))?.label ?? 'Admin';

  return (
    <div className="admin-shell">

      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <FlaskConical size={20} color="var(--color-primary)" />
          </div>
          <div>
            <div className="admin-brand-name">Medipath Admin</div>
            <div className="admin-brand-sub">Management Panel</div>
          </div>
          {/* Close button — mobile only */}
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="admin-nav">
          {navLinks.map(({ label, path, icon: Icon }) => {
            const active = location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`admin-nav-link ${active ? 'admin-nav-link--active' : ''}`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="admin-main">
        {/* Top header */}
        <header className="admin-header">
          {/* Hamburger — mobile only */}
          <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <span className="admin-header-title">{currentPage}</span>

          <button
            className="admin-refresh-btn"
            onClick={() => window.location.reload()}
            title="Refresh data"
          >
            <RefreshCw size={15} />
            <span className="admin-refresh-text">Refresh</span>
          </button>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* ── Bottom nav bar (mobile only) ── */}
      <nav className="admin-bottom-nav">
        {navLinks.map(({ label, path, icon: Icon }) => {
          const active = location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`admin-bottom-nav-item ${active ? 'admin-bottom-nav-item--active' : ''}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
