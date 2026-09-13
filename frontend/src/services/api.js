import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// BUCKETLIST APIS
export const getBucketlist = async () => {
  const res = await api.get('/bucketlist');
  return res.data.data;
};

export const createBucketlist = async (data) => {
  const res = await api.post('/bucketlist', data);
  return res.data;
};

export const updateBucketlist = async (id, data) => {
  const res = await api.put(`/bucketlist/${id}`, data);
  return res.data;
};

export const deleteBucketlist = async (id) => {
  const res = await api.delete(`/bucketlist/${id}`);
  return res.data;
};


// EXPENSES APIS
export const getExpenses = async () => {
  const res = await api.get('/expenses');
  return res.data;
};

export const createExpense = async (data) => {
  const res = await api.post('/expenses', data);
  return res.data;
};

export const updateExpense = async (id, data) => {
  const res = await api.put(`/expenses/${id}`, data);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
};

export const settleExpenses = async () => {
  const res = await api.post('/expenses/settle');
  return res.data;
};


// SAVINGS (TABUNGAN BERSAMA 2 ORANG) APIS
export const getSavings = async () => {
  const res = await api.get('/savings');
  return res.data;
};

export const createSavingsGoal = async (data) => {
  const res = await api.post('/savings', data);
  return res.data;
};

export const updateSavingsGoal = async (id, data) => {
  const res = await api.put(`/savings/${id}`, data);
  return res.data;
};

export const deleteSavingsGoal = async (id) => {
  const res = await api.delete(`/savings/${id}`);
  return res.data;
};

export const addSavingsDeposit = async (goalId, data) => {
  const res = await api.post(`/savings/${goalId}/deposits`, data);
  return res.data;
};

export const deleteSavingsDeposit = async (goalId, depositId) => {
  const res = await api.delete(`/savings/${goalId}/deposits/${depositId}`);
  return res.data;
};


// EVENTS / CALENDAR APIS
export const getEvents = async () => {
  const res = await api.get('/events');
  return res.data.data;
};

export const createEvent = async (data) => {
  const res = await api.post('/events', data);
  return res.data;
};

export const updateEvent = async (id, data) => {
  const res = await api.put(`/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};

// SETTINGS APIS
export const getSettings = async () => {
  const res = await api.get('/settings');
  return res.data.data;
};

export const updateSettings = async (data) => {
  const res = await api.put('/settings', data);
  return res.data;
};

// SYNC / GOOGLE SHEETS APIS
export const getSyncStatus = async () => {
  const res = await api.get('/sync/status');
  return res.data;
};

export const testGoogleSheetConnection = async (url) => {
  const res = await api.post('/sync/test-connection', { url });
  return res.data;
};

export const syncToGoogleSheet = async () => {
  const res = await api.post('/sync/sync-to-sheet');
  return res.data;
};

export const syncFromGoogleSheet = async () => {
  const res = await api.post('/sync/sync-from-sheet');
  return res.data;
};

export const getAppsScriptCode = async () => {
  const res = await api.get('/sync/script-code');
  return res.data.code;
};

export default api;
