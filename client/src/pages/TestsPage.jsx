import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Search, FlaskConical, Loader2, Clock, Microscope, TestTubes,
  Beaker, Droplets, Bug, Dna, ShieldCheck, Syringe, ScanEye,
  HeartPulse, ChevronRight, X, ChevronDown
} from 'lucide-react';
import { fetchTests, fetchDepartments } from '../services/api';
import { Link, useLocation } from 'react-router-dom';

// ─── Department Icons & Colors ────────────────────────────────────
const DEPARTMENT_META = {
  'HAEMATOLOGY': {
    icon: Droplets,
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)',
  },
  'BIOCHEMISTRY': {
    icon: Beaker,
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  },
  'ENDOCRINOLOGY & SPECIAL': {
    icon: Dna,
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  },
  'URINE EXAMINATION': {
    icon: TestTubes,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    gradient: 'linear-gradient(135deg, #d97706, #b45309)',
  },
  'STOOL EXAMINATION': {
    icon: FlaskConical,
    color: '#65a30d',
    bg: '#f7fee7',
    border: '#d9f99d',
    gradient: 'linear-gradient(135deg, #65a30d, #4d7c0f)',
  },
  'SEROLOGY': {
    icon: Syringe,
    color: '#0891b2',
    bg: '#ecfeff',
    border: '#a5f3fc',
    gradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
  },
  'HISTOPATHOLOGY': {
    icon: Microscope,
    color: '#be185d',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    gradient: 'linear-gradient(135deg, #be185d, #9d174d)',
  },
  'CYTOLOGY': {
    icon: ScanEye,
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
  },
  'MICROBIOLOGY': {
    icon: Bug,
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
    gradient: 'linear-gradient(135deg, #ea580c, #c2410c)',
  },
  'ANDROLOGY': {
    icon: HeartPulse,
    color: '#4f46e5',
    bg: '#eef2ff',
    border: '#c7d2fe',
    gradient: 'linear-gradient(135deg, #4f46e5, #4338ca)',
  },
  'IMMUNOLOGY': {
    icon: ShieldCheck,
    color: '#0d9488',
    bg: '#f0fdfa',
    border: '#99f6e4',
    gradient: 'linear-gradient(135deg, #0d9488, #0f766e)',
  },
  'General': {
    icon: FlaskConical,
    color: '#64748b',
    bg: '#f8fafc',
    border: '#e2e8f0',
    gradient: 'linear-gradient(135deg, #64748b, #475569)',
  },
};

// Fallback for unknown departments
const DEFAULT_META = {
  icon: FlaskConical,
  color: '#64748b',
  bg: '#f8fafc',
  border: '#e2e8f0',
  gradient: 'linear-gradient(135deg, #64748b, #475569)',
};

function getDeptMeta(dept) {
  return DEPARTMENT_META[dept] || DEFAULT_META;
}

export default function TestsPage() {
  const location = useLocation();

  const [tests, setTests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptCounts, setDeptCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(() => {
    return new URLSearchParams(window.location.search).get('search') || '';
  });
  const [activeDepartment, setActiveDepartment] = useState(() => {
    return new URLSearchParams(window.location.search).get('department') || 'All';
  });

  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Sync from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dept = params.get('department');
    const q = params.get('search');

    if (dept) setActiveDepartment(dept);
    if (q !== null) setSearch(q || '');
  }, [location.search]);

  // Fetch all data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [testsRes, deptsRes] = await Promise.all([
          fetchTests(),
          fetchDepartments(),
        ]);
        setTests(testsRes.data.data);
        setDepartments(deptsRes.data.data || []);
        setDeptCounts(deptsRes.data.counts || {});
      } catch {
        // empty state
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Client-side filtering
  const filtered = useMemo(() => {
    return tests.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.category || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.department || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.code || '').toLowerCase().includes(search.toLowerCase());
      const matchDept =
        activeDepartment === 'All' ||
        (t.department || '').toLowerCase() === activeDepartment.toLowerCase();
      return matchSearch && matchDept;
    });
  }, [tests, search, activeDepartment]);

  // Total test count
  const totalCount = tests.length;

  // Group filtered tests by department for display
  const groupedByDept = useMemo(() => {
    if (activeDepartment !== 'All') return null; // Don't group when filtering by specific dept

    const groups = {};
    filtered.forEach((t) => {
      const dept = t.department || 'General';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(t);
    });
    return groups;
  }, [filtered, activeDepartment]);

  return (
    <>
      <Helmet>
        <title>Tests & Pricing — Medipath Diagnostic Centre, Midnapore</title>
        <meta
          name="description"
          content="Browse diagnostic tests and prices at Medipath Diagnostic & Consultation Centre, MITRA COMPOUND, E/52,Near RK Honda Service Center, Opposite Shib Mandir, Shekhpura, Paschim Midnapore, West Bengal -721101. Blood tests, urine tests, pathology — budget-friendly rates by Dr. A.K. Maiti & Dr. Roma Basu Maiti. Call +91 9083276651 / 9083276652 / 03222-275238."
        />
      </Helmet>

      <main>
        {/* ─── Header ──────────────────────────────────────── */}
        <section className="tests-hero">
          <div className="container">
            <div className="tests-hero-content">
              <span className="section-label">Test Catalogue</span>
              <h1 style={{ marginBottom: '0.5rem' }}>
                Tests & <span className="text-gradient-primary">Pricing</span>
              </h1>
              <p style={{ maxWidth: '520px', marginBottom: '1.75rem', fontSize: '1.0625rem' }}>
                Browse our comprehensive range of diagnostic tests across {departments.length} departments.
                {totalCount > 0 && <> Currently offering <strong style={{ color: 'var(--color-primary)' }}>{totalCount}</strong> active tests.</>}
              </p>

              {/* Search */}
              <div className="tests-search-wrap">
                <Search size={18} className="tests-search-icon" />
                <input
                  id="test-search-input"
                  className="input tests-search-input"
                  placeholder="Search tests by name, code, or department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="tests-search-clear"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Department Filters ─────────────────────────── */}
        <section className="tests-filters-section">
          <div className="container">
            {/* Desktop View: Chips */}
            <div className="tests-dept-scroll hide-mobile" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
              {/* All button */}
              <button
                id="dept-filter-all"
                className={`dept-chip ${activeDepartment === 'All' ? 'dept-chip-active' : ''}`}
                onClick={() => setActiveDepartment('All')}
              >
                <FlaskConical size={16} />
                <span>All</span>
                <span className="dept-chip-count">{totalCount}</span>
              </button>

              {departments.map((dept) => {
                const meta = getDeptMeta(dept);
                const Icon = meta.icon;
                const isActive = activeDepartment === dept;
                const count = deptCounts[dept] || 0;

                return (
                  <button
                    key={dept}
                    id={`dept-filter-${dept.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                    className={`dept-chip ${isActive ? 'dept-chip-active' : ''}`}
                    onClick={() => setActiveDepartment(dept)}
                    style={isActive ? {
                      background: meta.gradient,
                      borderColor: 'transparent',
                      color: '#fff',
                    } : {
                      '--dept-color': meta.color,
                      '--dept-bg': meta.bg,
                      '--dept-border': meta.border,
                    }}
                  >
                    <Icon size={16} />
                    <span>{dept}</span>
                    <span className="dept-chip-count" style={isActive ? { background: 'rgba(255,255,255,0.25)', color: '#fff' } : {}}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile View: Custom Dropdown */}
            <div className="hide-desktop" style={{ position: 'relative' }}>
              <button
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--color-surface)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: 'var(--color-text)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  {(() => {
                    if (activeDepartment === 'All') {
                      return <FlaskConical size={18} color="var(--color-primary)" />;
                    }
                    const meta = getDeptMeta(activeDepartment);
                    const ActiveIcon = meta.icon;
                    return <ActiveIcon size={18} color={meta.color} />;
                  })()}
                  <span>{activeDepartment === 'All' ? 'All Departments' : activeDepartment}</span>
                </div>
                <ChevronDown 
                  size={20} 
                  style={{ 
                    color: 'var(--color-text-muted)', 
                    transition: 'transform 0.25s', 
                    transform: isMobileDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' 
                  }} 
                />
              </button>

              {isMobileDropdownOpen && (
                <>
                  <div 
                    onClick={() => setIsMobileDropdownOpen(false)} 
                    style={{ position: 'fixed', inset: 0, zIndex: 45 }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--color-border)',
                    zIndex: 50,
                    maxHeight: '320px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.5rem',
                    animation: 'fadeInUp 0.2s ease-out'
                  }}>
                    <button
                      onClick={() => { setActiveDepartment('All'); setIsMobileDropdownOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem 1rem', width: '100%',
                        background: activeDepartment === 'All' ? 'var(--color-primary-50)' : 'transparent',
                        border: 'none', borderRadius: 'var(--radius-sm)',
                        color: activeDepartment === 'All' ? 'var(--color-primary)' : 'var(--color-text)',
                        fontWeight: activeDepartment === 'All' ? 700 : 500,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.2s'
                      }}
                    >
                      <FlaskConical size={18} color={activeDepartment === 'All' ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                      <span>All Departments</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', background: activeDepartment === 'All' ? 'var(--color-primary)' : 'var(--color-bg-alt)', color: activeDepartment === 'All' ? 'white' : 'var(--color-text-muted)', padding: '0.1rem 0.6rem', borderRadius: '1rem', fontWeight: 600 }}>{totalCount}</span>
                    </button>

                    {departments.map((dept) => {
                      const meta = getDeptMeta(dept);
                      const Icon = meta.icon;
                      const isActive = activeDepartment === dept;
                      return (
                        <button
                          key={dept}
                          onClick={() => { setActiveDepartment(dept); setIsMobileDropdownOpen(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem 1rem', width: '100%',
                            background: isActive ? meta.bg : 'transparent',
                            border: 'none', borderRadius: 'var(--radius-sm)',
                            color: isActive ? meta.color : 'var(--color-text)',
                            fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer', textAlign: 'left',
                            transition: 'background 0.2s'
                          }}
                        >
                          <Icon size={18} color={isActive ? meta.color : 'var(--color-text-muted)'} />
                          <span>{dept}</span>
                          <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', background: isActive ? meta.color : 'var(--color-bg-alt)', color: isActive ? 'white' : 'var(--color-text-muted)', padding: '0.1rem 0.6rem', borderRadius: '1rem', fontWeight: 600 }}>{deptCounts[dept] || 0}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ─── Test Results ────────────────────────────────── */}
        <section className="section" style={{ background: 'var(--color-bg)', paddingTop: '2rem' }}>
          <div className="container">
            {/* Active filter info bar */}
            {(activeDepartment !== 'All' || search) && (
              <div className="tests-active-filter-bar">
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
                  Showing <strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> test{filtered.length !== 1 ? 's' : ''}
                  {activeDepartment !== 'All' && (
                    <> in <span className="badge badge-primary" style={{ marginLeft: '0.375rem' }}>
                      {activeDepartment}
                    </span></>
                  )}
                  {search && (
                    <> matching "<strong>{search}</strong>"</>
                  )}
                </p>
                {(activeDepartment !== 'All' || search) && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setActiveDepartment('All'); setSearch(''); }}
                    style={{ gap: '0.375rem' }}
                  >
                    <X size={14} /> Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="tests-loading-state">
                <Loader2 size={40} className="tests-spinner" />
                <p>Loading test catalogue...</p>
              </div>
            ) : filtered.length === 0 ? (
              /* Empty state */
              <div className="tests-empty-state">
                <div className="tests-empty-icon-wrap">
                  <FlaskConical size={44} />
                </div>
                <h3>No tests found</h3>
                <p>
                  Try a different search term or department. Or call us at{' '}
                  <a href="tel:+919083276651" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                    +91 9083276651 / 9083276652 / 03222-275238
                  </a>{' '}
                  to enquire.
                </p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => { setActiveDepartment('All'); setSearch(''); }}
                  style={{ marginTop: '1rem' }}
                >
                  Reset filters
                </button>
              </div>
            ) : activeDepartment !== 'All' || search ? (
              /* Flat grid when filtering by specific dept or search */
              <div className="tests-grid">
                {filtered.map((test) => (
                  <TestCard key={test._id} test={test} />
                ))}
              </div>
            ) : (
              /* Grouped by department when showing All */
              <div className="tests-grouped">
                {Object.entries(groupedByDept || {})
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([dept, deptTests]) => {
                    const meta = getDeptMeta(dept);
                    const Icon = meta.icon;

                    return (
                      <div key={dept} className="tests-dept-group">
                        <div className="tests-dept-group-header">
                          <div className="tests-dept-group-icon" style={{ background: meta.gradient }}>
                            <Icon size={20} color="#fff" />
                          </div>
                          <div>
                            <h3 className="tests-dept-group-title">{dept}</h3>
                            <span className="tests-dept-group-count">{deptTests.length} test{deptTests.length !== 1 ? 's' : ''}</span>
                          </div>
                          <button
                            className="btn btn-ghost btn-sm tests-dept-view-all"
                            onClick={() => setActiveDepartment(dept)}
                          >
                            View all <ChevronRight size={16} />
                          </button>
                        </div>
                        <div className="tests-grid">
                          {deptTests.slice(0, 6).map((test) => (
                            <TestCard key={test._id} test={test} />
                          ))}
                        </div>
                        {deptTests.length > 6 && (
                          <button
                            className="btn btn-outline btn-sm tests-show-more"
                            onClick={() => setActiveDepartment(dept)}
                          >
                            Show all {deptTests.length} tests in {dept} <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {/* CTA */}
            {!loading && filtered.length > 0 && (
              <div className="tests-cta">
                <p style={{ marginBottom: '1rem', fontWeight: 500 }}>
                  Ready to book? Medipath offers home collection in Midnapore & nearby areas.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/book" className="btn btn-primary btn-lg">Book Home Collection</Link>
                  <a href="tel:+919083276651" className="btn btn-outline btn-lg">Call +91 9083276651 / 9083276652 / 03222-275238</a>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

// ─── Individual Test Card Component ──────────────────────────────
function TestCard({ test }) {
  const meta = getDeptMeta(test.department);

  return (
    <article className="test-card card" id={`test-${test._id}`}>
      <div className="test-card-dept-bar" style={{ background: meta.gradient }} />
      <div className="test-card-body">
        <div className="test-card-top">
          <div className="test-card-info">
            <h4 className="test-card-name">{test.name}</h4>
            <span
              className="test-card-dept-badge"
              style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}
            >
              {test.department || 'General'}
            </span>
          </div>
          <div className="test-card-price">
            <span className="test-card-price-value">
              {!test.price || test.price === 0 || test.price === 1 || test.price === '0' || test.price === '1' ? <span style={{ fontSize: '0.75rem', lineHeight: '1.2', display: 'inline-block' }}>Contact<br/>Reception</span> : `₹${test.price}`}
            </span>
          </div>
        </div>
        {test.description && (
          <p className="test-card-desc">{test.description}</p>
        )}
        <div className="test-card-footer">
          <div className="test-card-turnaround">
            <Clock size={13} />
            Report in {test.turnaroundHours}h
          </div>
          {test.code && (
            <span className="test-card-code">#{test.code}</span>
          )}
        </div>
      </div>
    </article>
  );
}
