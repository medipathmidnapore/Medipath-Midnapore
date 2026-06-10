import { useState, useEffect, useCallback } from 'react';
import {
  User, Phone, MapPin, Search, Plus, Minus, Check, ChevronRight,
  ChevronLeft, FlaskConical, CheckCircle, AlertCircle, Loader2, Upload, FileText, X
} from 'lucide-react';
import { fetchTests, createBooking, uploadPrescription } from '../services/api';

const STEPS = ['Patient Info', 'Tests & Prescription', 'Review & Confirm'];

const initialForm = {
  patientName: '',
  email: '',
  mobile1: '',
  mobile2: '',
  address: '',
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_MB = 10;

export default function TestBookingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Step 2 — Tests & Prescription
  const [searchQuery, setSearchQuery] = useState('');
  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);

  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  
  const [notes, setNotes] = useState('');

  // Submit
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | success | error
  const [bookingResult, setBookingResult] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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
      // Ignore errors silently for now
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

  // File Upload Handlers
  const validateAndSetFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError('Invalid file type. Please upload JPG, PNG, WEBP, or PDF only.');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setPrescriptionFile(f);
    setFileError('');
    if (f.type.startsWith('image/')) {
      setPrescriptionPreview(URL.createObjectURL(f));
    } else {
      setPrescriptionPreview(null);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSetFile(dropped);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) validateAndSetFile(selected);
  };

  // Validation
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
    if (step === 1 && selectedTests.length === 0 && !prescriptionFile) {
      setFileError('Please select at least one test OR upload a prescription.');
      return;
    }
    setFileError('');
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      let prescriptionUrl = '';

      // Upload Prescription first if exists
      if (prescriptionFile) {
        const formData = new FormData();
        formData.append('prescription', prescriptionFile);
        formData.append('patientName', form.patientName);
        formData.append('mobileNumber', form.mobile1);
        if (form.email) formData.append('email', form.email);

        const uploadRes = await uploadPrescription(formData, (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(pct);
        });
        prescriptionUrl = uploadRes.data.cloudinaryUrl;
      }

      const payload = {
        patientName: form.patientName,
        email: form.email,
        mobile1: form.mobile1,
        mobile2: form.mobile2,
        address: form.address,
        tests: selectedTests.map((t) => ({ testId: t._id, name: t.name, price: t.price })),
        prescriptionUrl, // Attach to booking
        notes,
      };

      const res = await createBooking(payload);
      setBookingResult(res.data.data);
      setSubmitStatus('success');
    } catch (err) {
      setSubmitError(err.message || 'An error occurred during submission.');
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <div
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
        <h2 style={{ marginBottom: '0.75rem', color: 'var(--color-success)' }}>
          {selectedTests.length > 0 && prescriptionFile ? 'Booking & Prescription Submitted!' :
           prescriptionFile ? 'Prescription Uploaded!' : 'Booking Confirmed!'}
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Your request has been received securely. Our team will contact you shortly.
        </p>
        
        <button className="btn btn-outline" onClick={() => { 
          setStep(0); setForm(initialForm); setSelectedTests([]); 
          setPrescriptionFile(null); setPrescriptionPreview(null);
          setSubmitStatus('idle'); setBookingResult(null); 
        }}>
          Done
        </button>
      </div>
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
      <>
        <div
          key={step}
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

          {/* ── Step 1: Test Selection & Prescription Upload ── */}
          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '0.375rem' }}>Select Tests OR Upload Prescription</h3>
              <p style={{ marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
                You can select specific tests from the list, or simply upload your doctor's prescription.
              </p>

              {/* Prescription Upload Zone */}
              <div
                className={`upload-zone ${dragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('prescription-input').click()}
                style={{ marginBottom: '1.5rem', cursor: 'pointer', padding: '1.5rem', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius)', textAlign: 'center' }}
              >
                <input
                  id="prescription-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                
                {prescriptionFile ? (
                  <div style={{ pointerEvents: 'none' }}>
                    {prescriptionPreview ? (
                      <img
                        src={prescriptionPreview}
                        alt="Preview"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius)', margin: '0 auto 0.5rem' }}
                      />
                    ) : (
                      <FileText size={32} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem' }} />
                    )}
                    <p style={{ fontWeight: 600 }}>{prescriptionFile.name}</p>
                    <button className="btn btn-ghost" style={{ marginTop: '0.5rem', zIndex: 10 }} onClick={(e) => { e.stopPropagation(); setPrescriptionFile(null); setPrescriptionPreview(null); }}>
                       Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={24} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem' }} />
                    <p style={{ fontWeight: 600 }}>Click or Drag to Upload Prescription</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>JPG, PNG, PDF (Max 10MB)</p>
                  </>
                )}
              </div>

              {/* OR Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                <span style={{ padding: '0 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>AND / OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              </div>

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input
                  id="test-search"
                  className="input"
                  placeholder="Search and add specific tests..."
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
                  maxHeight: '260px',
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
                            {test.category}
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

              {fileError && (
                 <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-error)', marginTop: '0.75rem' }}>
                   {fileError}
                 </p>
              )}

              {/* Additional Notes */}
              <div style={{ marginTop: '2rem' }}>
                <label htmlFor="notes" style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                  Additional Notes / Symptoms (Optional)
                </label>
                <textarea
                  id="notes"
                  className="input"
                  placeholder="E.g. Fever since 3 days, fasting required, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Review & Confirm ── */}
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

              {/* Items Summary */}
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Request Details
                </h4>
                
                {prescriptionFile && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: selectedTests.length > 0 ? '1rem' : '0' }}>
                    <FileText size={16} color="var(--color-primary)" />
                    <span style={{ fontWeight: 600 }}>Prescription Attached:</span> {prescriptionFile.name}
                  </div>
                )}

                {selectedTests.length > 0 && (
                   <>
                    {selectedTests.map((t) => (
                      <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                        <span style={{ fontSize: '0.9375rem' }}>{t.name}</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>₹{t.price}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', fontWeight: 700, fontSize: '1.0625rem' }}>
                      <span>Estimated Total</span>
                      <span style={{ color: 'var(--color-primary)' }}>₹{totalAmount}</span>
                    </div>
                  </>
                )}

                {notes && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-light)' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--color-text-muted)' }}>Additional Notes:</p>
                    <p style={{ fontSize: '0.9375rem', fontStyle: 'italic', color: 'var(--color-text)' }}>"{notes}"</p>
                  </div>
                )}
              </div>
              
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--color-primary-50)', border: '1px solid var(--color-primary)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                   <strong>Note:</strong> Payment is not required now. Our team will verify your request and confirm the final amount and collection time via phone.
                </p>
              </div>

              {submitStatus === 'error' && (
                <div style={{ padding: '0.875rem 1rem', background: 'var(--color-error-bg)', borderRadius: 'var(--radius)', color: 'var(--color-error)', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={16} /> {submitError}
                </div>
              )}

              {/* Upload Progress */}
              {submitStatus === 'loading' && prescriptionFile && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    <span>Uploading Prescription & Submitting...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--color-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.3s' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              className="btn btn-ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0 || submitStatus === 'loading'}
              style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={handleNext}
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
                  <><span className="spinner" style={{ width: '1rem', height: '1rem' }} /> Processing...</>
                ) : (
                  <><Check size={18} /> Confirm Request</>
                )}
              </button>
            )}
          </div>
        </div>
      </>
    </div>
  );
}
