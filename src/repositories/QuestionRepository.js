const knexConfig = require("../../knexfile")
const knex = require("knex")(knexConfig)

const { BaseRepository } = require("@cubos/knex-repository");

class QuestionRepository extends BaseRepository {
    constructor() {
        super(knex, "questions");
    }

    async getQuestion(id) {
        const question = await knex('questions as q')
            .leftJoin('alternatives as a', 'a.questionId', 'q.id')
            .select(
                'q.*',
                knex.raw('JSON_AGG((a.description, a.correct)) as alternatives'),
            )
            .where('q.id', id)
            .groupBy('q.id')
            .returning('*');
    
        return question;
    }
}

module.exports = { QuestionRepository };