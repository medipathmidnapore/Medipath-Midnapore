import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, MapPin, Search, Plus, Minus, Check, ChevronRight,
  ChevronLeft, FlaskConical, CreditCard, Wallet, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { fetchTests, createBooking } from '../services/api';

const STEPS = ['Patient Info', 'Select Tests', 'Review & Pay'];

const initialForm = {
  patientName: '',
  email: '',
  mobile1: '',
  mobile2: '',
  address: '',
};

export default function TestBookingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Step 2 — Tests
  const [searchQuery, setSearchQuery] = useState('');
  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);

  // Step 3 — Payment
  const [paymentMode, setPaymentMode] = useState('full');

  // Submit
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | success | error
  const [bookingResult, setBookingResult] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // Load tests when entering step 2
  useEffect(() => {
    if (step === 1 && allTests.length === 0) {
      loadTests();
    }
  }, [step]);

  const loadTests = async () => {
    setLoadingTests(true);
    try {
      const res = await fetchTests();
      setAllTests(res.data.data);
      setFilteredTests(res.data.data);
    } catch {
      // Show empty state
    } finally {
      setLoadingTests(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTests(allTests);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredTests(
        allTests.filter(
          (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, allTests]);

  const toggleTest = (test) => {
    setSelectedTests((prev) =>
      prev.find((t) => t._id === test._id)
        ? prev.filter((t) => t._id !== test._id)
        : [...prev, test]
    );
  };

  const isSelected = (id) => selectedTests.some((t) => t._id === id);

  const totalAmount = selectedTests.reduce((sum, t) => sum + t.price, 0);
  const amountPaid = paymentMode === 'full' ? totalAmount : Math.ceil(totalAmount / 2);
  const balanceDue = totalAmount - amountPaid;

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!form.patientName.trim()) errs.patientName = 'Patient name is required.';
    if (!form.mobile1.trim() || !/^\d{10}$/.test(form.mobile1.trim()))
      errs.mobile1 = 'Enter a valid 10-digit mobile number.';
    if (form.mobile2 && !/^\d{10}$/.test(form.mobile2.trim()))
      errs.mobile2 = 'Enter a valid 10-digit number.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address.';
    if (!form.address.trim()) errs.address = 'Address is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && selectedTests.length === 0) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitStatus('loading');
    try {
      const payload = {
        patientName: form.patientName,
        email: form.email,
        mobile1: form.mobile1,
        mobile2: form.mobile2,
        address: form.address,
        tests: selectedTests.map((t) => ({ testId: t._id, name: t.name, price: t.price })),
        paymentMode,
      };
      const res = await createBooking(payload);
      setBookingResult(res.data.data);
      setSubmitStatus('success');
    } catch (err) {
      setSubmitError(err.message);
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card card-elevated"
        style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}
      >
        <div
          style={{
            width: '5.5rem', height: '5.5rem', borderRadius: '50%',
            background: 'var(--color-success-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <CheckCircle size={44} color="var(--color-success)" />
        </div>
        <h2 style={{ marginBottom: '0.75rem', color: 'var(--color-success)' }}>Booking Confirmed!</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Your home collection has been scheduled. Our team will call you shortly.
        </p>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
          <p><strong>Booking ID:</strong> <span style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>{bookingResult?.bookingId}</span></p>
          <p><strong>Total:</strong> ₹{bookingResult?.totalAmount}</p>
          <p><strong>Paid:</strong> ₹{bookingResult?.amountPaid}</p>
          {bookingResult?.balanceDue > 0 && (
            <p style={{ color: 'var(--color-error)' }}><strong>Balance Due:</strong> ₹{bookingResult?.balanceDue}</p>
          )}
        </div>
        <button className="btn btn-outline" onClick={() => { setStep(0); setForm(initialForm); setSelectedTests([]); setSubmitStatus('idle'); setBookingResult(null); }}>
          Book Another
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Step Indicator */}
      <div className="step-indicator">
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
              <div className={`step-dot ${i < step ? 'completed' : i === step ? 'active' : ''}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: i === step ? 'var(--color-primary)' : 'var(--color-text-light)', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-line ${i < step ? 'completed' : ''}`} style={{ margin: '0 0.5rem', marginBottom: '1.25rem' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="card card-elevated"
          style={{ padding: '2rem' }}
        >
          {/* ── Step 0: Patient Info ── */}
          {step === 0 && (
            <div>
              <h3 style={{ marginBottom: '0.375rem' }}>Patient Information</h3>
              <p style={{ marginBottom: '1.75rem', fontSize: '0.9375rem' }}>Enter the details of the person to be tested.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label htmlFor="patientName">
                    <User size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                    Full Name *
                  </label>
                  <input
                    id="patientName"
                    className={`input ${errors.patientName ? 'input-error' : ''}`}
                    placeholder="e.g. Priya Sharma"
                    value={form.patientName}
                    onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  />
                  {errors.patientName && <p style={{ color: 'var(--color-error)', fontSize: '0.8125rem', marginTop: '0.375rem' }}>{errors.patientName}</p>}
                </div>

                <div>
                  <label htmlFor="email">
                    Email Address (Optional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`input ${errors.email ? 'input-error' : ''}`}
                    placeholder="To receive booking confirmation and reports"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <p style={{ color: 'var(--color-error)', fontSize: '0.8125rem', marginTop: '0.375rem' }}>{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mobile1">
                      <Phone size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                      Mobile 1 *
                    </label>
                    <input
                      id="mobile1"
                      className={`input ${errors.mobile1 ? 'input-error' : ''}`}
                      placeholder="10-digit mobile"
                      value={form.mobile1}
                      onChange={(e) => setForm({ ...form, mobile1: e.target.value })}
                      maxLength={10}
                    />
                    {errors.mobile1 && <p style={{ color: 'var(--color-error)', fontSize: '0.8125rem', marginTop: '0.375rem' }}>{errors.mobile1}</p>}
                  </div>
                  <div>
                    <label htmlFor="mobile2">Mobile 2 (Optional)</label>
                    <input
                      id="mobile2"
                      className={`input ${errors.mobile2 ? 'input-error' : ''}`}
                      placeholder="Alternate number"
                      value={form.mobile2}
                      onChange={(e) => setForm({ ...form, mobile2: e.target.value })}
                      maxLength={10}
                    />
                    {errors.mobile2 && <p style={{ color: 'var(--color-error)', fontSize: '0.8125rem', marginTop: '0.375rem' }}>{errors.mobile2}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="address">
                    <MapPin size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                    Full Address *
                  </label>
                  <textarea
                    id="address"
                    className={`input ${errors.address ? 'input-error' : ''}`}
                    placeholder="House No, Street, Area, City, Pincode"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                  {errors.address && <p style={{ color: 'var(--color-error)', fontSize: '0.8125rem', marginTop: '0.375rem' }}>{errors.address}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Test Selection ── */}
          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '0.375rem' }}>Select Diagnostic Tests</h3>
              <p style={{ marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
                Search and add tests. {selectedTests.length > 0 && (
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                    {selectedTests.length} selected · ₹{totalAmount}
                  </span>
                )}
              </p>

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input
                  id="test-search"
                  className="input"
                  placeholder="Search tests by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>

              {/* Test List */}
              <div
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  maxHeight: '320px',
                  overflowY: 'auto',
                }}
              >
                {loadingTests ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <Loader2 size={28} style={{ margin: '0 auto 0.75rem', animation: 'spin 0.8s linear infinite' }} />
                    Loading tests...
                  </div>
                ) : filteredTests.length === 0 ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <FlaskConical size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                    No tests found.
                    {allTests.length === 0 && (
                      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Tests are loaded from the lab system. Please check back later or contact us.
                      </p>
                    )}
                  </div>
                ) : (
                  filteredTests.map((test) => {
                    const selected = isSelected(test._id);
                    return (
                      <div
                        key={test._id}
                        onClick={() => toggleTest(test)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.9375rem 1rem',
                          borderBottom: '1px solid var(--color-border-light)',
                          cursor: 'pointer',
                          background: selected ? 'var(--color-primary-50)' : 'transparent',
                          transition: 'background var(--transition)',
                        }}
                        onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'var(--color-bg-alt)'; }}
                        onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{test.name}</div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                            {test.category} · {test.turnaroundHours}h turnaround
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontWeight: 700, color: selected ? 'var(--color-primary)' : 'var(--color-text)', fontSize: '1rem' }}>
                            ₹{test.price}
                          </div>
                          <div
                            style={{
                              width: '1.75rem', height: '1.75rem', borderRadius: '50%',
                              background: selected ? 'var(--color-primary)' : 'transparent',
                              border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all var(--transition)',
                            }}
                          >
                            {selected ? <Check size={12} color="white" /> : <Plus size={12} color="var(--color-text-light)" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {selectedTests.length === 0 && (
                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-warning)', marginTop: '0.75rem' }}>
                  Please select at least one test to continue.
                </p>
              )}
            </div>
          )}

          {/* ── Step 2: Review & Pay ── */}
          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: '1.75rem' }}>Review & Confirm</h3>

              {/* Patient Summary */}
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem', background: 'var(--color-bg-alt)' }}>
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.8rem' }}>Patient Details</h4>
                <p style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{form.patientName}</p>
                <p style={{ fontSize: '0.9rem' }}>📱 {form.mobile1}{form.mobile2 && ` · ${form.mobile2}`}</p>
                {form.email && <p style={{ fontSize: '0.9rem' }}>✉️ {form.email}</p>}
                <p style={{ fontSize: '0.9rem' }}>📍 {form.address}</p>
              </div>

              {/* Tests Summary */}
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Selected Tests ({selectedTests.length})
                </h4>
                {selectedTests.map((t) => (
                  <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <span style={{ fontSize: '0.9375rem' }}>{t.name}</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>₹{t.price}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', fontWeight: 700, fontSize: '1.0625rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>₹{totalAmount}</span>
                </div>
              </div>

              {/* Payment Toggle */}
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Payment Option
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'full', label: 'Pay Full Amount', sublabel: `₹${totalAmount}`, icon: <CreditCard size={18} /> },
                    { value: 'advance50', label: 'Pay 50% Advance', sublabel: `₹${Math.ceil(totalAmount / 2)} now`, icon: <Wallet size={18} /> },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPaymentMode(opt.value)}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius)',
                        border: `2px solid ${paymentMode === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: paymentMode === opt.value ? 'var(--color-primary-50)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--transition)',
                        fontFamily: 'inherit',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: paymentMode === opt.value ? 'var(--color-primary)' : 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                        {opt.icon}
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{opt.label}</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: paymentMode === opt.value ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {opt.sublabel}
                      </div>
                    </button>
                  ))}
                </div>
                {paymentMode === 'advance50' && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-warning)', marginTop: '0.75rem' }}>
                    ⚠️ Balance of ₹{balanceDue} will be collected at the time of sample collection.
                  </p>
                )}
              </div>

              {submitStatus === 'error' && (
                <div style={{ padding: '0.875rem 1rem', background: 'var(--color-error-bg)', borderRadius: 'var(--radius)', color: 'var(--color-error)', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={16} /> {submitError}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              className="btn btn-ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={step === 1 && selectedTests.length === 0}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-teal btn-lg"
                onClick={handleSubmit}
                disabled={submitStatus === 'loading'}
              >
                {submitStatus === 'loading' ? (
                  <><span className="spinner" style={{ width: '1rem', height: '1rem' }} /> Confirming...</>
                ) : (
                  <><Check size={18} /> Confirm Booking</>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
