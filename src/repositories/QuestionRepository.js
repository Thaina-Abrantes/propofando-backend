const knexConfig = require("../../knexfile")
const knex = require("knex")(knexConfig)

const { BaseRepository } = require("@cubos/knex-repository");

class QuestionRepository extends BaseRepository {
    constructor() {
        super(knex, "questions");
    }
}

module.exports = { QuestionRepository };