import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Dna, Bone, Syringe, ArrowRight, Thermometer, Droplet, X, Loader2, FlaskConical } from 'lucide-react';
import { GiKidneys, GiLiver, GiHeartOrgan } from 'react-icons/gi';
import { fetchTests } from '../../services/api';

const categories = [
  { name: 'Heart', icon: <GiHeartOrgan size={36} color="#ef4444" />, bg: '#fee2e2' },
  { name: 'Liver', icon: <GiLiver size={36} color="#f59e0b" />, bg: '#fef3c7' },
  { name: 'Kidney', icon: <GiKidneys size={36} color="#3b82f6" />, bg: '#dbeafe' },
  { name: 'Thyroid/Hormone', icon: <Dna size={36} color="#8b5cf6" />, bg: '#ede9fe' },
  { name: 'Diabetes', icon: <Syringe size={36} color="#10b981" />, bg: '#d1fae5' },
  { name: 'Bone', icon: <Bone size={36} color="#64748b" />, bg: '#f1f5f9' },
  { name: 'Anemia', icon: <Droplet size={36} fill="#dc2626" color="#dc2626" />, bg: '#fecaca' },
  { name: 'Fever', icon: <Thermometer size={36} color="#ea580c" />, bg: '#ffedd5' },
];

export default function TestSearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for category-based test grid
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTests, setCategoryTests] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tests?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = async (categoryName) => {
    if (selectedCategory === categoryName) {
      // Toggle off if already selected
      setSelectedCategory(null);
      setCategoryTests([]);
      return;
    }

    setSelectedCategory(categoryName);
    setIsLoadingTests(true);

    try {
      const res = await fetchTests({ category: categoryName });
      if (res.data && res.data.success) {
        setCategoryTests(res.data.data);
      } else {
        setCategoryTests([]);
      }
    } catch (err) {
      console.error('Failed to fetch category tests:', err);
      setCategoryTests([]);
    } finally {
      setIsLoadingTests(false);
    }
  };

  return (
    <section className="section" style={{ background: 'var(--color-bg)', paddingTop: '1rem', paddingBottom: '6rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ display: 'inline-block', padding: '0.375rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', borderRadius: '2rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            Test Catalog
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>Find the Test You Need</h2>
          <p style={{ maxWidth: '550px', margin: '1rem auto 0', color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
            Explore our comprehensive diagnostic catalog by medical condition or body part below.
          </p>
        </div>

        {/* Search Bar Removed as per request */}
        
        {/* Test Categories */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '3rem', fontWeight: 800 }}>Browse by Category</h3>
          <div className="categories-grid">
            {categories.map((cat, i) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <div key={i}>
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.25rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text)',
                      width: '100%',
                      padding: '0.5rem',
                      transition: 'transform 0.3s ease',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
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
                      boxShadow: isSelected ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 10px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      border: isSelected ? '3px solid var(--color-primary)' : '3px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                      }
                    }}
                    >
                      {cat.icon}
                    </div>
                    <span style={{ 
                      fontWeight: isSelected ? 800 : 700, 
                      fontSize: '1.25rem',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text)'
                    }}>
                      {cat.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Expanded Category Tests Grid */}
          {selectedCategory && (
            <div style={{ 
              marginTop: '3rem', 
              padding: '2rem', 
              background: 'white', 
              borderRadius: 'var(--radius-xl)', 
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)',
              animation: 'fadeInUp 0.4s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ padding: '0.375rem', background: 'var(--color-primary-50)', borderRadius: '0.5rem', color: 'var(--color-primary)' }}>
                    <FlaskConical size={20} />
                  </span>
                  Tests for {selectedCategory}
                </h4>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="btn btn-ghost btn-sm"
                  style={{ borderRadius: '50%', padding: '0.5rem' }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {isLoadingTests ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <Loader2 size={32} className="spinner" style={{ margin: '0 auto 1rem auto', color: 'var(--color-primary)' }} />
                  <p>Loading {selectedCategory} tests...</p>
                </div>
              ) : categoryTests.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <p>No tests found for {selectedCategory}.</p>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                  gap: '1rem' 
                }}>
                  {categoryTests.map(test => (
                    <div 
                      key={test._id} 
                      style={{ 
                        padding: '1rem 1.25rem', 
                        background: 'var(--color-bg-alt)', 
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        transition: 'background 0.2s',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'white'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-bg-alt)'}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.4 }}>{test.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link to="/tests" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '3rem', padding: '1rem 2.5rem', fontSize: '1.125rem', fontWeight: 700 }}>
            View All Tests & Pricing <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
