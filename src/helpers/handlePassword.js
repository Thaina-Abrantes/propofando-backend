const bcrypt = require('bcryptjs');

async function encryptPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePasswords(firstPass, secondPass) {
  return bcrypt.compare(firstPass, secondPass);
}

module.exports = { encryptPassword, comparePasswords };
