const { BaseRepository } = require('@cubos/knex-repository');
const Knex = require('knex');

exports.up = async function (knex) {
    await BaseRepository.alterTable(knex, 'users', tableBuilder => {
        tableBuilder.boolean("active").defaultTo(true);
        tableBuilder.boolean("inactive").defaultTo(false);
    });
};
exports.down = async function (knex) {
    await BaseRepository.removeColumn(knex, 'active');
    await BaseRepository.removeColumn(knex, 'inactive');
};
