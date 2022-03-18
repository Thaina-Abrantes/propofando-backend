const { BaseRepository } = require('@cubos/knex-repository');

const Knex = require('knex');

exports.up = async function (knex) {
    
    await BaseRepository.createTable(knex, 'category', table => {
        table.string('name').notNullable();
    });
};

exports.down = async function (knex) {
    await BaseRepository.dropTable(knex, 'category');
};
