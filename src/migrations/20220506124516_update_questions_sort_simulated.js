const { BaseRepository } = require('@cubos/knex-repository');

exports.up = async function (knex) {
  await BaseRepository.alterTable(knex, 'questions_sort_simulated', (table) => {
    table.uuid('categoryId');
    table.foreign('categoryId').references('id').inTable('category');
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, 'questions_sort_simulated');
};
