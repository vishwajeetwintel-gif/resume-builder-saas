// In-memory store (replace with MongoDB in production)
const { v4: uuidv4 } = require('uuid');

const db = {
  users: [],
  resumes: [],
  payments: [],
  subscriptions: []
};

// User operations
const createUser = (userData) => {
  const user = { id: uuidv4(), ...userData, createdAt: new Date(), plan: 'free' };
  db.users.push(user);
  return user;
};

const findUserByEmail = (email) => db.users.find(u => u.email === email);
const findUserById = (id) => db.users.find(u => u.id === id);

const updateUser = (id, updates) => {
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...updates };
  return db.users[idx];
};

// Resume operations
const createResume = (resumeData) => {
  const resume = { id: uuidv4(), ...resumeData, createdAt: new Date(), updatedAt: new Date() };
  db.resumes.push(resume);
  return resume;
};

const findResumesByUser = (userId) => db.resumes.filter(r => r.userId === userId);
const findResumeById = (id) => db.resumes.find(r => r.id === id);

const updateResume = (id, updates) => {
  const idx = db.resumes.findIndex(r => r.id === id);
  if (idx === -1) return null;
  db.resumes[idx] = { ...db.resumes[idx], ...updates, updatedAt: new Date() };
  return db.resumes[idx];
};

const deleteResume = (id) => {
  const idx = db.resumes.findIndex(r => r.id === id);
  if (idx === -1) return false;
  db.resumes.splice(idx, 1);
  return true;
};

// Payment operations
const createPayment = (paymentData) => {
  const payment = { id: uuidv4(), ...paymentData, createdAt: new Date() };
  db.payments.push(payment);
  return payment;
};

const findPaymentByOrderId = (orderId) => db.payments.find(p => p.orderId === orderId);

// Subscription
const updateSubscription = (userId, plan, expiresAt) => {
  return updateUser(userId, { plan, subscriptionExpiry: expiresAt, updatedAt: new Date() });
};

module.exports = {
  createUser, findUserByEmail, findUserById, updateUser,
  createResume, findResumesByUser, findResumeById, updateResume, deleteResume,
  createPayment, findPaymentByOrderId, updateSubscription
};
