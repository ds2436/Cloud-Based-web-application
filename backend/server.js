require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./app/routes/auth');
const estimateRoutes = require('./app/routes/estimate');
const historyRoutes = require('./app/routes/history');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173', credentials: false }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/history', historyRoutes);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

