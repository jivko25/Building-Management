'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_measures', [
      { id: 1, name: 'Квадратен метър' },
      { id: 2, name: 'Линеен метър' }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_measures', null, {});
  }
};