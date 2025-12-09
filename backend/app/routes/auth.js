const express = require('express');
const { createUser, validateUser } = require('../services/userStore');
const { issueToken } = require('../services/tokenService');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  try {
    const user = await createUser(username.trim(), password);
    const token = issueToken({ username: user.username });
    res.status(201).json({ token, user: { username: user.username } });
  } catch (err) {
    const status = err.message === 'User already exists' ? 409 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const user = await validateUser(username.trim(), password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = issueToken({ username: user.username });
  res.json({ token, user: { username: user.username } });
});

module.exports = router;

