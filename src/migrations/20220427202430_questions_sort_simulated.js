const { BaseRepository } = require('@cubos/knex-repository');

exports.up = async function (knex) {
  await BaseRepository.createTable(knex, 'questions_sort_simulated', (table) => {
    table.string('name').notNullable();
    table.uuid('simulatedId').notNullable();
    table.uuid('userId').notNullable();
    table.uuid('altenativeId');
    table.uuid('questionId').notNullable();
    table.boolean('answered').defaultTo(false);
    table.foreign('userId').references('id').inTable('users');
    table.foreign('simulatedId').references('id').inTable('simulated');
    table.foreign('altenativeId').references('id').inTable('alternatives');
    table.foreign('questionId').references('id').inTable('questions');
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, 'questions_sort_simulated');
};
