import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Subhankar Dutta',
    meta: 'Local Guide · 793 reviews',
    text: 'Nice behaviour. Less Crowd. Timely report delivery. Perfect place.',
    rating: 5,
    time: '6 years ago',
  },
  {
    name: 'Dharamdas Murmu',
    meta: 'Local Guide · 65 reviews',
    text: 'Very good pathology for blood and urine test... and price are very fare.',
    rating: 5,
    time: '6 years ago',
  },
  {
    name: 'Sandip Samanta',
    meta: '191 reviews',
    text: 'One of the reliable diagnostic centre of Midnapore town. Recommended.',
    rating: 5,
    time: '5 years ago',
  },
  {
    name: 'Sasanka Sekhar Sau',
    meta: 'Local Guide · 545 reviews',
    text: 'This Diagnostic center is trustful and punctual in delivery of reports.',
    rating: 5,
    time: '8 years ago',
  },
  {
    name: 'ATANU MITRA',
    meta: 'Local Guide · 414 reviews',
    text: 'One of the best diagnostic centres in the district.',
    rating: 5,
    time: '2 years ago',
  },
  {
    name: 'Purna Nandi',
    meta: 'Local Guide · 39 reviews',
    text: 'One of the best lab.',
    rating: 5,
    time: 'a year ago',
  },
  {
    name: 'Manas Kumar Das',
    meta: 'Local Guide · 200 reviews',
    text: 'Very good Staff behavior and responsive on time.',
    rating: 5,
    time: '5 years ago',
  },
  {
    name: 'PRITHWISH PAUL',
    meta: 'Local Guide · 19 reviews',
    text: 'Best Pathological centre in Midnapore.',
    rating: 5,
    time: '7 years ago',
  },
  {
    name: 'Reyansh Sen',
    meta: 'Local Guide · 63 reviews',
    text: 'Good service and professional staff. Would recommend.',
    rating: 4,
    time: '2 years ago',
  },
  {
    name: 'MADHABI HALDER',
    meta: 'Local Guide · 35 reviews',
    text: 'Excellent diagnostic centre. Very professional.',
    rating: 5,
    time: '2 years ago',
  },
  {
    name: 'Amitkumar Bera',
    meta: 'Local Guide · 26 reviews',
    text: 'Good accommodation and staff. Comfortable experience.',
    rating: 4,
    time: '3 years ago',
  },
  {
    name: 'Bijan Ghosh',
    meta: 'Local Guide · 418 reviews',
    text: 'Long period service. Very reliable diagnostic centre.',
    rating: 5,
    time: '6 years ago',
  },
  {
    name: 'Nabakumar Ghosh',
    meta: 'Local Guide · 2 reviews',
    text: 'Great experience. Reliable and affordable diagnostic services.',
    rating: 4,
    time: 'a year ago',
  },
];

function StarRow({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.75rem' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          color="#f59e0b"
          fill={i < rating ? '#f59e0b' : 'none'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-quote-icon">
        <Quote size={16} color="var(--color-primary)" strokeWidth={2} />
      </div>
      <StarRow rating={review.rating} />
      <p className="testimonial-text">{review.text}</p>
      <div className="testimonial-footer">
        <div className="testimonial-avatar">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="testimonial-name">{review.name}</p>
          <p className="testimonial-meta">{review.meta} · {review.time}</p>
        </div>
        <div className="testimonial-google-badge" title="Google Review">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  // Duplicate the array so the loop looks seamless
  const doubled = [...reviews, ...reviews];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <span className="section-label">Patient Reviews</span>
          <h2>
            Trusted by Thousands,{' '}
            <span className="text-gradient-primary">Rated 4.3★ on Google</span>
          </h2>
          <p style={{ maxWidth: '500px', margin: '0.75rem auto 0', fontSize: '1rem' }}>
            Real feedback from patients who've experienced our care first-hand.
          </p>
        </div>
      </div>

      {/* Full-bleed marquee — outside container so cards bleed to edges */}
      <div className="testimonials-track-wrapper">
        <div className="testimonials-track">
          {doubled.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
