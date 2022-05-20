const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

const { BaseRepository } = require('@cubos/knex-repository');

class SimulatedRepository extends BaseRepository {
  constructor() {
    super(knex, 'simulated');
  }

  async listRandomQuestions(simulatedId, userId) {
    const randomQuestions = await knex('questions as q')
      .leftJoin('alternatives as a', 'a.questionId', 'q.id')
      .leftJoin('questions_sort_simulated as qss', 'qss.questionId', 'a.questionId')
      .select(
        'q.id',
        'q.title',
        'q.description',
        'q.categoryId',
        'q.image',
        knex.raw("JSON_AGG(JSON_BUILD_OBJECT('id', a.id, 'option', a.option, 'description', a.description)) as alternatives"),
      )
      .where({
        'qss.simulatedId': simulatedId,
        'qss.userId': userId,
      })
      .groupBy('q.id')
      .returning('*');

    return randomQuestions;
  }
}

module.exports = { SimulatedRepository };
