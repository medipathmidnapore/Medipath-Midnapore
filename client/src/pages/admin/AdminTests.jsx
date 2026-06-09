import { useState, useEffect } from 'react';
import { fetchTests, updateAdminTest, createAdminTest, deleteAdminTest } from '../../services/api';
import { Edit2, Plus, Trash2, Loader2, Save, X, Search } from 'lucide-react';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadTests();
  }, [search]);

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

  const handleEditClick = (test) => {
    setEditingId(test._id);
    setEditForm(test);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id) => {
    try {
      await updateAdminTest(id, editForm);
      setEditingId(null);
      loadTests(); // refresh
    } catch (err) {
      alert('Failed to update test');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await deleteAdminTest(id);
        loadTests();
      } catch (err) {
        alert('Failed to delete test');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Test Catalog</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage diagnostic tests and update pricing</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add New Test
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            <input
              type="text"
              className="input"
              placeholder="Search tests by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem', fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Test Name</th>
                <th style={{ padding: '1rem', fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Category</th>
                <th style={{ padding: '1rem', fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Code</th>
                <th style={{ padding: '1rem', fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Price (₹)</th>
                <th style={{ padding: '1rem', fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => {
                const isEditing = editingId === test._id;
                return (
                  <tr key={test._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '1rem' }}>
                      {isEditing ? (
                        <input className="input" style={{ padding: '0.25rem 0.5rem' }} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                      ) : (
                        <span style={{ fontWeight: 600 }}>{test.name}</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {isEditing ? (
                        <input className="input" style={{ padding: '0.25rem 0.5rem' }} value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} />
                      ) : test.category}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {isEditing ? (
                        <input className="input" style={{ padding: '0.25rem 0.5rem', width: '80px' }} value={editForm.code} onChange={e => setEditForm({...editForm, code: e.target.value})} />
                      ) : test.code}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {isEditing ? (
                        <input type="number" className="input" style={{ padding: '0.25rem 0.5rem', width: '100px' }} value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} />
                      ) : (
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{test.price}</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleSave(test._id)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', minHeight: 'auto' }}>
                            <Save size={14} /> Save
                          </button>
                          <button onClick={handleCancelEdit} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', minHeight: 'auto' }}>
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleEditClick(test)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', minHeight: 'auto' }}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(test._id)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', minHeight: 'auto', color: 'var(--color-error)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {tests.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No tests found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
