const bcrypt = require('bcryptjs');

const users = new Map();

async function createUser(username, password) {
  if (users.has(username)) {
    throw new Error('User already exists');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { username, passwordHash, createdAt: new Date().toISOString() };
  users.set(username, user);
  return user;
}

async function validateUser(username, password) {
  const user = users.get(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

function getUser(username) {
  return users.get(username) || null;
}

module.exports = { createUser, validateUser, getUser };

