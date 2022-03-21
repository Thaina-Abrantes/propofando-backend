const knexConfig = require("../../knexfile")
const knex = require("knex")(knexConfig)

const { BaseRepository } = require("@cubos/knex-repository");

class QuestionsRepository extends BaseRepository {
    constructor() {
        super(knex, "questions");
    }
}

module.exports = { QuestionsRepository };