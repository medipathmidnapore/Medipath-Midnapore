import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/config.db.js';
import { syncTestsFromMainServer } from './controllers/controller.test.js';

// Route imports
import testRoutes from './routes/route.test.js';
import prescriptionRoutes from './routes/route.prescription.js';
import bookingRoutes from './routes/route.booking.js';
import reportRoutes from './routes/route.report.js';
import adminRoutes from './routes/route.admin.js';
import noticeRoutes from './routes/route.notice.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ──────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ─── Request Logging ──────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Body Parsers ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── API Routes ───────────────────────────────────────────
app.use('/api/tests', testRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notices', noticeRoutes);

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Medipath Proxy Server is running.',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ─── Start Server ─────────────────────────────────────────
import Test from './models/model.test.js';

const SYNC_INTERVAL_HOURS = 24; // Only auto-sync if last sync was more than 24 hours ago

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Medipath Server running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`);
    console.log(`🌐 Main Server: ${process.env.MAIN_SERVER_URL}`);
  });

  // Auto-sync test catalog — only if last sync was more than 24 hours ago
  // Non-blocking — server starts even if sync check fails
  try {
    const mostRecentTest = await Test.findOne({ lastSyncedAt: { $exists: true } })
      .sort({ lastSyncedAt: -1 })
      .select('lastSyncedAt')
      .lean();

    const now = Date.now();
    const lastSync = mostRecentTest?.lastSyncedAt ? new Date(mostRecentTest.lastSyncedAt).getTime() : 0;
    const hoursSinceSync = (now - lastSync) / (1000 * 60 * 60);

    if (hoursSinceSync >= SYNC_INTERVAL_HOURS) {
      console.log(`📋 Last test sync was ${Math.round(hoursSinceSync)}h ago — syncing from main server...`);
      syncTestsFromMainServer()
        .then((result) => {
          if (result.success) {
            console.log(`✅ Test sync complete: ${result.synced} tests synced.`);
          } else {
            console.warn(`⚠️  Test sync issue: ${result.message}`);
          }
        })
        .catch((err) => {
          console.warn('⚠️  Test auto-sync failed (non-critical):', err.message);
        });
    } else {
      console.log(`📋 Test catalog is fresh (synced ${Math.round(hoursSinceSync)}h ago) — skipping auto-sync.`);
    }
  } catch (err) {
    console.warn('⚠️  Could not check last sync time:', err.message);
  }
};

startServer();
