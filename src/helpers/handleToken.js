const jwt = require('jsonwebtoken');

async function generateToken(info) {
  const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
}

async function validateToken(tkn) {
  const token = await jwt.verify(tkn, process.env.JWT_SECRET);
  return token;
}

module.exports = { generateToken, validateToken };
