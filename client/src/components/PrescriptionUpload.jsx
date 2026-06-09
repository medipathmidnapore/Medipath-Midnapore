import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadPrescription } from '../services/api';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_MB = 10;

export default function PrescriptionUpload() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Patient Details
  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const validateAndSetFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      setErrorMsg('Invalid file type. Please upload JPG, PNG, WEBP, or PDF only.');
      setStatus('error');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      setStatus('error');
      return;
    }
    setFile(f);
    setStatus('idle');
    setErrorMsg('');
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
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

  const handleUpload = async () => {
    if (!file || !patientName || !mobileNumber) {
      setErrorMsg('Please provide your name, mobile number, and select a file.');
      setStatus('error');
      return;
    }
    
    setStatus('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append('prescription', file);
    formData.append('patientName', patientName);
    formData.append('mobileNumber', mobileNumber);

    try {
      const res = await uploadPrescription(formData, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(pct);
      });
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Upload failed. Please try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
    setPatientName('');
    setMobileNumber('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="card"
            style={{ padding: '3rem 2rem', textAlign: 'center' }}
          >
            <div
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                background: 'var(--color-success-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <CheckCircle size={40} color="var(--color-success)" />
            </div>
            <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-success)' }}>Uploaded Successfully!</h3>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
              Thank you, {patientName}. Your prescription has been securely uploaded. Our team will review it and contact you shortly at {mobileNumber}.
            </p>
            <button className="btn btn-outline" onClick={reset}>
              Upload Another
            </button>
          </motion.div>
        ) : (
          <motion.div key="uploader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            {/* Patient Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Patient Name *</label>
                <input 
                  type="text" 
                  className="input" 
                  value={patientName} 
                  onChange={e => setPatientName(e.target.value)} 
                  placeholder="e.g. John Doe"
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Mobile Number *</label>
                <input 
                  type="tel" 
                  className="input" 
                  value={mobileNumber} 
                  onChange={e => setMobileNumber(e.target.value)} 
                  placeholder="e.g. 9876543210"
                  required 
                />
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`upload-zone ${dragging ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('prescription-input').click()}
              style={{ marginBottom: '1.5rem', cursor: 'pointer' }}
            >
              <input
                id="prescription-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {file ? (
                <div style={{ pointerEvents: 'none' }}>
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius)', margin: '0 auto 1rem' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '5rem',
                        height: '5rem',
                        background: 'var(--color-primary-50)',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                      }}
                    >
                      <FileText size={36} color="var(--color-primary)" />
                    </div>
                  )}
                  <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{file.name}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change file
                  </p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      width: '5rem',
                      height: '5rem',
                      background: 'var(--color-primary-50)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                    }}
                  >
                    <Upload size={30} color="var(--color-primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    {dragging ? 'Drop your file here' : 'Drag & Drop your Prescription'}
                  </h3>
                  <p style={{ marginBottom: '1rem', fontSize: '0.9375rem' }}>
                    or <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>click to browse</span>
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['JPG', 'PNG', 'WEBP', 'PDF'].map((type) => (
                      <span key={type} className="badge badge-primary">{type}</span>
                    ))}
                    <span className="badge" style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}>
                      Max {MAX_SIZE_MB}MB
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Error */}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.875rem 1rem',
                  background: 'var(--color-error-bg)',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius)',
                  color: 'var(--color-error)',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {errorMsg}
              </motion.div>
            )}

            {/* Progress */}
            {status === 'uploading' && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!file || !patientName || !mobileNumber || status === 'uploading'}
                style={{ flex: 1 }}
              >
                {status === 'uploading' ? (
                  <>
                    <span className="spinner" style={{ width: '1rem', height: '1rem' }} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} /> Upload Prescription
                  </>
                )}
              </button>
              {file && (
                <button className="btn btn-ghost" onClick={reset} disabled={status === 'uploading'}>
                  <X size={16} /> Clear
                </button>
              )}
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
              🔒 Your file is encrypted and stored securely on Cloudinary CDN
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
