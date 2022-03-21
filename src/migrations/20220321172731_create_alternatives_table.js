const { BaseRepository } = require('@cubos/knex-repository');

exports.up = async function (knex) {
  await BaseRepository.createTable(knex, 'alternatives', (table) => {
    table.string('title', 1700).notNullable();
    table.boolean('correct').defaultTo(false);
    table.uuid('questionId').notNullable;
    table.foreign('questionId').references('id').inTable('questions');
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, 'alternatives');
};
