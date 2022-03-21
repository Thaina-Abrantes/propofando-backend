const knexConfig = require('../../knexfile')
const knex = require('knex')(knexConfig)

const { BaseRepository } = require('@cubos/knex-repository');

class AlternativeRepository extends BaseRepository {
    constructor() {
        super(knex, 'alternatives');
    }
}

module.exports = { AlternativeRepository };