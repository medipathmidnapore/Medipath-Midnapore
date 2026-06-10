import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, FlaskConical, Loader2, Filter, Clock } from 'lucide-react';
import { fetchTests, fetchCategories } from '../services/api';
import { Link, useLocation } from 'react-router-dom';

export default function TestsPage() {
  const location = useLocation();
  
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState(() => {
    return new URLSearchParams(window.location.search).get('search') || '';
  });
  const [activeCategory, setActiveCategory] = useState(() => {
    return new URLSearchParams(window.location.search).get('category') || 'All';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const q = params.get('search');
    
    if (cat) setActiveCategory(cat);
    if (q !== null) setSearch(q || ''); // allow clearing search if explicitly empty
  }, [location.search]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [testsRes, catsRes] = await Promise.all([fetchTests(), fetchCategories()]);
        setTests(testsRes.data.data);
        setCategories(['All', ...catsRes.data.data]);
      } catch {
        // empty state
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = tests.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory.toLowerCase() === 'all' || t.category.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <>
      <Helmet>
        <title>Tests & Pricing — Medipath Diagnostic Centre, Midnapore</title>
        <meta name="description" content="Browse diagnostic tests and prices at Medipath Diagnostic & Consultation Centre, Shekhpura, Midnapore (WB 721101). Blood tests, urine tests, pathology — budget-friendly rates by Dr. A.K. Maiti & Dr. Roma Basu Maiti. Call +91 90832 76651." />
      </Helmet>

      <main>
        {/* Header */}
        <section style={{ background: 'white', borderBottom: '1px solid var(--color-border)', padding: '3rem 0 2rem' }}>
          <div className="container">
            <div>
              <span className="section-label">Test Catalogue</span>
              <h1 style={{ marginBottom: '1.5rem' }}>Tests & Pricing</h1>

              {/* Search */}
              <div style={{ position: 'relative', maxWidth: '480px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input
                  className="input"
                  placeholder="Search tests by name or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '3rem', fontSize: '1rem' }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ background: 'var(--color-bg)', paddingTop: '2rem' }}>
          <div className="container">
            {/* Category Filters */}
            {categories.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {categories.map((cat) => {
                  const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                      style={{
                        border: isActive ? 'none' : '1px solid var(--color-border)',
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Test Grid */}
            {loading ? (
              <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Loader2 size={36} style={{ margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite', color: 'var(--color-primary)' }} />
                Loading tests...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '5rem', textAlign: 'center' }}>
                <FlaskConical size={40} style={{ margin: '0 auto 1rem', color: 'var(--color-text-light)' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>No tests found</h3>
                <p>Try a different search term or category. Or call us at <a href="tel:+919083276651" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>+91 90832 76651</a> to enquire.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {filtered.map((test, i) => (
                  <div
                    key={test._id}
                    className="card"
                    style={{ padding: '1.5rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{test.name}</h4>
                        <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>{test.category}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{test.price}</div>
                      </div>
                    </div>
                    {test.description && (
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{test.description}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      <Clock size={13} /> Report in {test.turnaroundHours}h
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            {!loading && filtered.length > 0 && (
              <div
                style={{ textAlign: 'center', marginTop: '3rem' }}
              >
                <p style={{ marginBottom: '1rem', fontWeight: 500 }}>Ready to book? Medipath offers home collection in Midnapore & nearby areas.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/book" className="btn btn-primary btn-lg">Book Home Collection</Link>
                  <a href="tel:+919083276651" className="btn btn-outline btn-lg">Call +91 90832 76651</a>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
