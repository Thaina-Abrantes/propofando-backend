const knexConfig = require("../../knexfile")
const knex = require("knex")(knexConfig)

const { BaseRepository } = require("@cubos/knex-repository");

class UserRepository extends BaseRepository {
    constructor() {
        super(knex, "users");
    }
}
module.exports = { UserRepository };