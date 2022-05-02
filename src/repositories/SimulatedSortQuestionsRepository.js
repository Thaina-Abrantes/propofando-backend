const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

const { BaseRepository } = require('@cubos/knex-repository');

class SimulatedSortQuestionsRepository extends BaseRepository {
  constructor() {
    super(knex, 'questions_sort_simulated');
  }
}

module.exports = { SimulatedSortQuestionsRepository };
