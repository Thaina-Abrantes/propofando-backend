const knexConfig = require('../../knexfile')
const knex = require('knex')(knexConfig)

const { BaseRepository } = require('@cubos/knex-repository');

class RecoveryRepository extends BaseRepository {
    constructor() {
        super(knex, 'recoveries');
    }
}
module.exports = { RecoveryRepository };