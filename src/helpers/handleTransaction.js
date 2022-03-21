const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

async function generateTransaction() {
  return await knex.transaction();
}

module.exports = { generateTransaction };
