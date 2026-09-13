const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const bucketlistRoutes = require('./routes/bucketlist');
const expensesRoutes = require('./routes/expenses');
const savingsRoutes = require('./routes/savings');
const eventsRoutes = require('./routes/events');
const settingsRoutes = require('./routes/settings');
const syncRoutes = require('./routes/sync');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static file serving for uploaded photos & receipts
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/bucketlist', bucketlistRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/sync', syncRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Travel Bucketlist & Finance 2-Person API',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend dist if built, otherwise redirect or render guide
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // If frontend not built yet, redirect or render quick link
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DuoVenture API Server</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
          .card { background: white; padding: 40px 30px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); max-width: 480px; width: 100%; border: 1px solid #e2e8f0; }
          .icon { font-size: 48px; margin-bottom: 12px; }
          h1 { margin: 0 0 8px; font-size: 22px; font-weight: 800; color: #0f172a; }
          p { margin: 0 0 24px; font-size: 14px; color: #64748b; line-height: 1.6; }
          .btn { display: inline-block; background: #059669; color: white; text-decoration: none; padding: 12px 28px; border-radius: 14px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(5,150,105,0.25); transition: 0.2s; }
          .btn:hover { background: #047857; transform: translateY(-1px); }
          .badge { display: inline-block; background: #ecfdf5; color: #047857; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; border: 1px solid #a7f3d0; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✈️</div>
          <span class="badge">🟢 Backend API Aktif (Port 5000)</span>
          <h1>DuoVenture Server</h1>
          <p>Port <strong>5000</strong> adalah server backend API. Tampilan aplikasi web utama berjalan di port <strong>3000</strong>.</p>
          <a href="http://localhost:3000" class="btn">Buka Aplikasi Web (localhost:3000) &rarr;</a>
        </div>
      </body>
      </html>
    `);
  });
}

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Backend Server running at: http://localhost:${PORT}`);
  console.log(`📁 Uploads Directory: ${uploadsDir}`);
  console.log(`📊 Google Sheets Integration: Ready`);
  console.log(`====================================================`);
});
