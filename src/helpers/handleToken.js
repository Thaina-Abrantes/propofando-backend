 const jwt = require('jsonwebtoken');

function generateToken(info) {
  const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
}

function validateToken(tkn) {
  const token = jwt.verify(tkn, process.env.JWT_SECRET);
  return token;
}

module.exports = { 
  generateToken,
   validateToken,
};
