import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ReportsPage from './pages/ReportsPage';
import TestsPage from './pages/TestsPage';
import NoticePage from './pages/NoticePage';
import { AuthProvider } from './context/AuthContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminTests from './pages/admin/AdminTests';
import AdminNotices from './pages/admin/AdminNotices';
import AdminSettings from './pages/admin/AdminSettings';
import { useLocation } from 'react-router-dom';
import './index.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <Navbar />}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/notices" element={<NoticePage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="tests" element={<AdminTests />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  </AuthProvider>
  );
}

export default App;
