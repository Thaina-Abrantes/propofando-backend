const knexConfig = require("../../knexfile")
const knex = require("knex")(knexConfig)


const { BaseRepository } = require("@cubos/knex-repository");

class CategoryRepository extends BaseRepository {
    constructor() {
        super(knex, "category");
    }
}
module.exports = { CategoryRepository };