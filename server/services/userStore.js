const bcrypt = require('bcryptjs');

// In-memory store - replace with MongoDB/PostgreSQL in production
const users = new Map();
const resumes = new Map();
const subscriptions = new Map();

const userStore = {
  async createUser(email, password, name) {
    if (users.has(email)) throw new Error('User already exists');
    const hash = await bcrypt.hash(password, 12);
    const user = { id: Date.now().toString(), email, password: hash, name, plan: 'free', createdAt: new Date() };
    users.set(email, user);
    return { id: user.id, email, name, plan: user.plan };
  },
  async findByEmail(email) {
    return users.get(email);
  },
  async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  },
  async updatePlan(userId, plan) {
    for (const [email, user] of users) {
      if (user.id === userId) {
        user.plan = plan;
        user.planUpdatedAt = new Date();
        users.set(email, user);
        return user;
      }
    }
  },
  saveResume(userId, resume) {
    const key = `${userId}_${resume.id || Date.now()}`;
    const data = { ...resume, id: resume.id || Date.now().toString(), userId, updatedAt: new Date() };
    resumes.set(key, data);
    return data;
  },
  getResumes(userId) {
    const result = [];
    for (const [key, resume] of resumes) {
      if (key.startsWith(`${userId}_`)) result.push(resume);
    }
    return result;
  },
  getResume(userId, resumeId) {
    return resumes.get(`${userId}_${resumeId}`);
  },
  deleteResume(userId, resumeId) {
    return resumes.delete(`${userId}_${resumeId}`);
  }
};

module.exports = userStore;
