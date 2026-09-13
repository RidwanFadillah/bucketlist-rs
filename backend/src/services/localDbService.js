const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/local_database.json');

function ensureDbExists() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      bucketlist: [],
      expenses: [],
      savings: [],
      events: [],
      settings: {
        p1Name: 'Ridwan',
        p2Name: 'Princess',
        p1Avatar: '',
        p2Avatar: '',
        currency: 'IDR',
        theme: 'adventure',
        googleSheetUrl: '',
        googleSheetName: 'Database Bucketlist & Keuangan',
        lastSyncedAt: null
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.savings) data.savings = [];
    if (!data.bucketlist) data.bucketlist = [];
    if (!data.expenses) data.expenses = [];
    if (!data.events) data.events = [];
    if (!data.settings) data.settings = {};
    return data;
  } catch (err) {
    console.error('Error reading database file:', err);
    return { bucketlist: [], expenses: [], savings: [], events: [], settings: {} };
  }
}

function writeDb(data) {
  ensureDbExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// BUCKETLIST HELPERS
function getBucketlist() {
  return readDb().bucketlist || [];
}

function addBucketlistItem(item) {
  const db = readDb();
  db.bucketlist.unshift(item);
  writeDb(db);
  return item;
}

function updateBucketlistItem(id, updates) {
  const db = readDb();
  const index = db.bucketlist.findIndex(b => b.id === id);
  if (index === -1) return null;
  db.bucketlist[index] = { ...db.bucketlist[index], ...updates, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.bucketlist[index];
}

function deleteBucketlistItem(id) {
  const db = readDb();
  const initialLen = db.bucketlist.length;
  db.bucketlist = db.bucketlist.filter(b => b.id !== id);
  writeDb(db);
  return db.bucketlist.length < initialLen;
}

// SAVINGS (TABUNGAN BERSAMA 2 ORANG) HELPERS
function getSavings() {
  return readDb().savings || [];
}

function addSavingsGoal(goal) {
  const db = readDb();
  db.savings.unshift(goal);
  writeDb(db);
  return goal;
}

function updateSavingsGoal(id, updates) {
  const db = readDb();
  const index = db.savings.findIndex(s => s.id === id);
  if (index === -1) return null;
  db.savings[index] = { ...db.savings[index], ...updates, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.savings[index];
}

function deleteSavingsGoal(id) {
  const db = readDb();
  const initialLen = db.savings.length;
  db.savings = db.savings.filter(s => s.id !== id);
  writeDb(db);
  return db.savings.length < initialLen;
}

function addSavingsDeposit(goalId, deposit) {
  const db = readDb();
  const index = db.savings.findIndex(s => s.id === goalId);
  if (index === -1) return null;
  if (!db.savings[index].deposits) db.savings[index].deposits = [];
  db.savings[index].deposits.unshift(deposit);
  db.savings[index].updatedAt = new Date().toISOString();
  writeDb(db);
  return db.savings[index];
}

function deleteSavingsDeposit(goalId, depositId) {
  const db = readDb();
  const index = db.savings.findIndex(s => s.id === goalId);
  if (index === -1) return null;
  db.savings[index].deposits = (db.savings[index].deposits || []).filter(d => d.id !== depositId);
  db.savings[index].updatedAt = new Date().toISOString();
  writeDb(db);
  return db.savings[index];
}

// EXPENSES HELPERS
function getExpenses() {
  return readDb().expenses || [];
}

function addExpenseItem(item) {
  const db = readDb();
  db.expenses.unshift(item);
  writeDb(db);
  return item;
}

function updateExpenseItem(id, updates) {
  const db = readDb();
  const index = db.expenses.findIndex(e => e.id === id);
  if (index === -1) return null;
  db.expenses[index] = { ...db.expenses[index], ...updates, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.expenses[index];
}

function deleteExpenseItem(id) {
  const db = readDb();
  const initialLen = db.expenses.length;
  db.expenses = db.expenses.filter(e => e.id !== id);
  writeDb(db);
  return db.expenses.length < initialLen;
}

function settleExpenses() {
  const db = readDb();
  db.expenses = db.expenses.map(exp => ({ ...exp, isSettled: true }));
  writeDb(db);
  return db.expenses;
}

// EVENTS HELPERS
function getEvents() {
  return readDb().events || [];
}

function addEventItem(item) {
  const db = readDb();
  db.events.push(item);
  writeDb(db);
  return item;
}

function updateEventItem(id, updates) {
  const db = readDb();
  const index = db.events.findIndex(ev => ev.id === id);
  if (index === -1) return null;
  db.events[index] = { ...db.events[index], ...updates, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.events[index];
}

function deleteEventItem(id) {
  const db = readDb();
  const initialLen = db.events.length;
  db.events = db.events.filter(ev => ev.id !== id);
  writeDb(db);
  return db.events.length < initialLen;
}

// SETTINGS HELPERS
function getSettings() {
  return readDb().settings || {};
}

function updateSettings(updates) {
  const db = readDb();
  db.settings = { ...db.settings, ...updates, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.settings;
}

module.exports = {
  readDb,
  writeDb,
  getBucketlist,
  addBucketlistItem,
  updateBucketlistItem,
  deleteBucketlistItem,
  getSavings,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addSavingsDeposit,
  deleteSavingsDeposit,
  getExpenses,
  addExpenseItem,
  updateExpenseItem,
  deleteExpenseItem,
  settleExpenses,
  getEvents,
  addEventItem,
  updateEventItem,
  deleteEventItem,
  getSettings,
  updateSettings
};
