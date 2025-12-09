const fs = require('fs/promises');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const historyFile = path.join(dataDir, 'history.json');

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(historyFile);
  } catch {
    await fs.writeFile(historyFile, JSON.stringify({ users: {} }, null, 2), 'utf8');
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(historyFile, 'utf8');
  return JSON.parse(raw || '{"users":{}}');
}

async function writeStore(store) {
  await fs.writeFile(historyFile, JSON.stringify(store, null, 2), 'utf8');
}

async function addEntry(username, entry) {
  const store = await readStore();
  if (!store.users[username]) store.users[username] = [];
  store.users[username].push(entry);
  await writeStore(store);
  return entry;
}

async function getHistory(username) {
  const store = await readStore();
  return store.users[username] || [];
}

module.exports = { addEntry, getHistory };

