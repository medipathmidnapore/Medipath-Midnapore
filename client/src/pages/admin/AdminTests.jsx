import { useState, useEffect } from 'react';
import { fetchTests, updateAdminTest, deleteAdminTest } from '../../services/api';
import { Edit2, Plus, Trash2, Loader2, Save, X, Search, FlaskConical } from 'lucide-react';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { loadTests(); }, [search]);

  const loadTests = async () => {
    try {
      const res = await fetchTests({ search });
      setTests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (test) => { setEditingId(test._id); setEditForm(test); };
  const handleCancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleSave = async (id) => {
    try {
      await updateAdminTest(id, editForm);
      setEditingId(null);
      loadTests();
    } catch { alert('Failed to update test'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this test?')) {
      try { await deleteAdminTest(id); loadTests(); }
      catch { alert('Failed to delete test'); }
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Test Catalog</h1>
          <p className="admin-page-subtitle">Manage diagnostic tests and pricing</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Test
        </button>
      </div>

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
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map(test => {
                  const isEditing = editingId === test._id;
                  return (
                    <tr key={test._id}>
                      <td>
                        {isEditing
                          ? <input className="input" style={{ padding: '0.25rem 0.5rem' }} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                          : <span style={{ fontWeight: 600 }}>{test.name}</span>}
                      </td>
                      <td>
                        {isEditing
                          ? <input className="input" style={{ padding: '0.25rem 0.5rem' }} value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} />
                          : test.category}
                      </td>
                      <td>
                        {isEditing
                          ? <input className="input" style={{ padding: '0.25rem 0.5rem', width: '80px' }} value={editForm.code} onChange={e => setEditForm({ ...editForm, code: e.target.value })} />
                          : test.code}
                      </td>
                      <td>
                        {isEditing
                          ? <input type="number" className="input" style={{ padding: '0.25rem 0.5rem', width: '100px' }} value={editForm.price} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} />
                          : <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{test.price}</span>}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleSave(test._id)} className="btn btn-primary btn-sm"><Save size={14} /> Save</button>
                            <button onClick={handleCancelEdit} className="btn btn-outline btn-sm"><X size={14} /></button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleEditClick(test)} className="btn btn-outline btn-sm"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(test._id)} className="btn btn-outline btn-sm" style={{ color: 'var(--color-error)' }}><Trash2 size={14} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {tests.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No tests found.</div>}
          </div>

          {/* ── Mobile: cards ── */}
          <div className="admin-test-cards">
            {tests.map(test => {
              const isEditing = editingId === test._id;
              return (
                <div key={test._id} className="card admin-test-card">
                  <div className="admin-test-card-icon">
                    <FlaskConical size={18} color="var(--color-primary)" />
                  </div>

                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1 }}>
                      <input className="input" style={{ padding: '0.5rem 0.75rem' }} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                      <input className="input" style={{ padding: '0.5rem 0.75rem' }} value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input className="input" style={{ padding: '0.5rem 0.75rem', flex: 1 }} value={editForm.code} onChange={e => setEditForm({ ...editForm, code: e.target.value })} placeholder="Code" />
                        <input type="number" className="input" style={{ padding: '0.5rem 0.75rem', width: '100px' }} value={editForm.price} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} placeholder="₹" />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <button onClick={() => handleSave(test._id)} className="btn btn-primary btn-sm" style={{ flex: 1 }}><Save size={14} /> Save</button>
                        <button onClick={handleCancelEdit} className="btn btn-outline btn-sm"><X size={14} /></button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{test.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                        {test.category} {test.code && <span style={{ fontFamily: 'monospace', background: 'var(--color-bg-alt)', padding: '0.1em 0.4em', borderRadius: '4px', marginLeft: '0.25rem' }}>{test.code}</span>}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-primary)' }}>₹{test.price}</div>
                    </div>
                  )}

                  {!isEditing && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <button onClick={() => handleEditClick(test)} className="btn btn-outline btn-sm"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(test._id)} className="btn btn-outline btn-sm" style={{ color: 'var(--color-error)' }}><Trash2 size={14} /></button>
                    </div>
                  )}
                </div>
              );
            })}
            {tests.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No tests found.</div>}
          </div>
        </>
      )}
    </div>
  );
}
