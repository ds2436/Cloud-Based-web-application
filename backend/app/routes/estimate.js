const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { estimateEmission } = require('../services/climatiq');
const { addEntry } = require('../services/historyStore');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { activity_id, data_version, parameters } = req.body || {};

  if (!activity_id || typeof activity_id !== 'string') {
    return res.status(400).json({ error: 'activity_id is required' });
  }
  if (!parameters || typeof parameters !== 'object') {
    return res.status(400).json({ error: 'parameters is required' });
  }

  const body = {
    emission_factor: {
      activity_id: activity_id.trim(),
      ...(data_version ? { data_version } : {}),
    },
    parameters,
  };

  try {
    const estimate = await estimateEmission(body);

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      activity_id: estimate.emission_factor?.activity_id || activity_id,
      activity_name: estimate.emission_factor?.name || activity_id,
      co2e: estimate.co2e,
      co2e_unit: estimate.co2e_unit,
      parameters,
    };

    await addEntry(req.user.username, entry);
    res.json({ estimate, entry });
  } catch (err) {
    console.error('Climatiq error:', err);
    res.status(err.status || 500).json({ error: err.message, details: err.details });
  }
});

module.exports = router;

