const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

const { BaseRepository } = require('@cubos/knex-repository');

class SimulatedRepository extends BaseRepository {
  constructor() {
    super(knex, 'simulated');
  }
}

module.exports = { SimulatedRepository };
