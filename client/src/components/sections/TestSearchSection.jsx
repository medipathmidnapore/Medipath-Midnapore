import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, HeartPulse, Activity, Brain, Droplets, Bone, Stethoscope, ArrowRight, TestTube2, Thermometer } from 'lucide-react';

const categories = [
  { name: 'Heart', icon: <HeartPulse size={36} color="#ef4444" />, bg: '#fee2e2' },
  { name: 'Liver', icon: <Activity size={36} color="#f59e0b" />, bg: '#fef3c7' },
  { name: 'Kidney', icon: <Droplets size={36} color="#3b82f6" />, bg: '#dbeafe' },
  { name: 'Thyroid/Hormone', icon: <Brain size={36} color="#8b5cf6" />, bg: '#ede9fe' },
  { name: 'Diabetes', icon: <Stethoscope size={36} color="#10b981" />, bg: '#d1fae5' },
  { name: 'Bone', icon: <Bone size={36} color="#64748b" />, bg: '#f1f5f9' },
  { name: 'Anemia', icon: <TestTube2 size={36} color="#dc2626" />, bg: '#fecaca' },
  { name: 'Fever', icon: <Thermometer size={36} color="#ea580c" />, bg: '#ffedd5' },
];

export default function TestSearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Live Search
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      setShowDropdown(true);
      const timer = setTimeout(() => {
        fetch(`/api/tests?search=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setSearchResults(data.data || []);
            } else {
              setSearchResults([]);
            }
          })
          .catch(err => console.error('Failed to fetch tests:', err))
          .finally(() => setIsSearching(false));
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tests?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="section" style={{ background: 'var(--color-bg)', paddingTop: '1rem', paddingBottom: '6rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ display: 'inline-block', padding: '0.375rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', borderRadius: '2rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            Find Your Test
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>Search Tests & Check Prices</h2>
          <p style={{ maxWidth: '550px', margin: '1rem auto 0', color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
            Type the name of the test you are looking for, or browse by popular health categories below.
          </p>
        </div>

        {/* Search Bar with Live Search Dropdown */}
        <div style={{ maxWidth: '750px', margin: '0 auto 5rem auto', position: 'relative' }} ref={dropdownRef}>
          <form onSubmit={handleSearch} className="search-form" style={{ position: 'relative', zIndex: 51 }}>
            <div style={{ padding: '0.25rem 0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
              <Search size={24} />
            </div>
            <input
              type="text"
              placeholder="Search by test name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) setShowDropdown(true);
              }}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: '1.125rem',
                outline: 'none',
                color: 'var(--color-text)',
                fontWeight: 500,
                width: '100%',
                minWidth: '0'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary search-btn"
            >
              <Search size={20} className="search-icon-mobile" />
              <span className="search-btn-text">Search</span>
            </button>
          </form>

          {/* Live Search Results Dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '1rem',
              right: '1rem',
              marginTop: '0.5rem',
              background: 'white',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              zIndex: 50,
              maxHeight: '350px',
              overflowY: 'auto',
              border: '1px solid var(--color-border)',
              padding: '0.5rem 0'
            }}>
              {isSearching ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem auto', color: 'var(--color-primary)' }}></div>
                  Searching tests...
                </div>
              ) : searchResults.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {searchResults.map(test => (
                    <li key={test._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <Link 
                        to={`/tests?search=${encodeURIComponent(test.name)}`}
                        onClick={() => setShowDropdown(false)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem 1.5rem',
                          textDecoration: 'none',
                          color: 'var(--color-text)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-alt)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{test.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>{test.category}</div>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)', background: 'var(--color-primary-50)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                          ₹{test.price > 0 ? test.price : 'TBD'}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No tests found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Test Categories */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '3rem', fontWeight: 800 }}>Browse by Category</h3>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div key={i}>
                <Link
                  to={`/tests?category=${encodeURIComponent(cat.name)}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                    textDecoration: 'none',
                    color: 'var(--color-text)',
                  }}
                >
                  <div style={{
                    width: '8rem',
                    height: '8rem',
                    borderRadius: '2.5rem',
                    background: cat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                  }}
                  >
                    {cat.icon}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{cat.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link to="/tests" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '3rem', padding: '1rem 2.5rem', fontSize: '1.125rem', fontWeight: 700 }}>
            View All Tests <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
