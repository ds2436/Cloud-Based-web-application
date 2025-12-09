const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getHistory } = require('../services/historyStore');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const items = await getHistory(req.user.username);
  // return most recent first
  res.json(items.slice().sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)));
});

module.exports = router;

