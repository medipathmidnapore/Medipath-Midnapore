import { useState, useEffect } from 'react';
import { fetchTests, syncTestsFromMainServer } from '../../services/api';
import { Loader2, Search, FlaskConical, RefreshCw, RefreshCcw, Info, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  useEffect(() => { loadTests(); }, [search]);

  const loadTests = async () => {
    setLoading(true);
    try {
      const res = await fetchTests({ search });
      setTests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncTestsFromMainServer();
      setSyncMessage({
        type: 'success',
        text: `Synced ${res.data.synced || 0} tests from the main server (${res.data.inserted || 0} new, ${res.data.updated || 0} updated).`,
      });
      // Refresh the test list after sync
      await loadTests();
    } catch (err) {
      setSyncMessage({
        type: 'error',
        text: err.message || 'Failed to sync tests from the main server.',
      });
    } finally {
      setSyncing(false);
      // Auto-dismiss message after 8 seconds
      setTimeout(() => setSyncMessage(null), 8000);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Test Catalog</h1>
          <p className="admin-page-subtitle">View all active diagnostic tests — synced from lab system</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary btn-sm" onClick={handleSync} disabled={syncing}>
            {syncing ? (
              <><Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Syncing…</>
            ) : (
              <><RefreshCcw size={15} /> Sync from Server</>
            )}
          </button>
          <button className="btn btn-outline btn-sm" onClick={loadTests}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* Read-only notice */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        padding: '0.875rem 1rem', background: '#eff6ff',
        border: '1px solid var(--color-primary-100)', borderRadius: 'var(--radius)',
        marginBottom: '1.25rem', fontSize: '0.875rem', color: '#1e3a8a',
      }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          <strong>Read-only.</strong> Test names, prices, and categories are managed by the main server.
          Click <strong>"Sync from Server"</strong> to pull the latest catalog. Tests with status "deactive" on the main server are hidden from the public site.
        </p>
      </div>

      {/* Sync feedback message */}
      {syncMessage && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
          marginBottom: '1rem', fontSize: '0.875rem',
          background: syncMessage.type === 'success' ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
          color: syncMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
          border: `1px solid ${syncMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
        }}>
          {syncMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {syncMessage.text}
        </div>
      )}

      {/* Search */}
      <div className="card admin-search-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          <input
            type="text"
            className="input"
            placeholder="Search tests by name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
        </div>
      ) : (
        <>
          {/* ── Desktop: table ── */}
          <div className="card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Category</th>
                  <th>Code</th>
                  <th>Price (₹)</th>
                  <th>TAT</th>
                  <th>Last Synced</th>
                </tr>
              </thead>
              <tbody>
                {tests.map(test => (
                  <tr key={test._id}>
                    <td><span style={{ fontWeight: 600 }}>{test.name}</span></td>
                    <td>
                      <span style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {test.category}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{test.code || '—'}</td>
                    <td><span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{test.price}</span></td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{test.turnaroundHours || 24}h</td>
                    <td style={{ color: 'var(--color-text-light)', fontSize: '0.8125rem' }}>
                      {test.lastSyncedAt ? new Date(test.lastSyncedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tests.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No tests found. Click "Sync from Server" to pull the test catalog from the main server.
              </div>
            )}
          </div>

          {/* ── Mobile: cards ── */}
          <div className="admin-test-cards">
            {tests.map(test => (
              <div key={test._id} className="card admin-test-card">
                <div className="admin-test-card-icon">
                  <FlaskConical size={18} color="var(--color-primary)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{test.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
                    <span style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)', padding: '0.1em 0.4em', borderRadius: '4px', fontWeight: 600 }}>
                      {test.category}
                    </span>
                    {test.code && (
                      <span style={{ fontFamily: 'monospace', background: 'var(--color-bg-alt)', padding: '0.1em 0.4em', borderRadius: '4px', marginLeft: '0.375rem' }}>
                        {test.code}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--color-primary)' }}>₹{test.price}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{test.turnaroundHours || 24}h TAT</span>
                  </div>
                </div>
              </div>
            ))}
            {tests.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No tests found. Click "Sync from Server" to pull the test catalog from the main server.
              </div>
            )}
          </div>

          <p style={{ textAlign: 'right', fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '0.75rem' }}>
            {tests.length} active test{tests.length !== 1 ? 's' : ''} loaded
          </p>
        </>
      )}
    </div>
  );
}
