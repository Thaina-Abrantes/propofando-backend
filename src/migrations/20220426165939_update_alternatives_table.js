const { BaseRepository } = require('@cubos/knex-repository');

exports.up = async function (knex) {
  await BaseRepository.alterTable(knex, 'alternatives', (table) => {
    table.string('option');
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, 'alternatives');
};
