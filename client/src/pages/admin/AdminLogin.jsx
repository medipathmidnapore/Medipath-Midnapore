import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { adminLogin } from '../../services/api';
import { Shield, Lock, Loader2, AlertTriangle } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await adminLogin({ email, password });
      login(res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div className="card card-elevated" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <img src={logo} alt="Medipath Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Admin Login</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Secure dashboard access</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Lock size={16} /> Sign In</>}
          </button>
        </form>
      </div>
    </div>
  );
}
