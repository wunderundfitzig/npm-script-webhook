const { createError } = require('micro');
const auth = require('basic-auth');

const username = process.env.NSW_USER;
const token = process.env.NSW_TOKEN;

module.exports = async (req) => {
  if (req.method !== 'POST') {
    throw createError(405, 'Method not allowed');
  } else {
    const user = auth(req);
    if (!user) {
      throw createError(401, 'Unauthorized');
    }

    const { name, pass } = user;
    if (name !== username || pass !== token) {
      throw createError(403, 'Invalid credentials');
    }
  }
};
