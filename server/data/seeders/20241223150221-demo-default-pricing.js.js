'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tbl_default_pricing', [
      {
        activity_id: 68,
        measure_id: 1,
        artisan_id: 1,
        price: 100.0
      },
      {
        activity_id: 72,
        measure_id: 2,
        artisan_id: 2,
        price: 150.0
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tbl_default_pricing', null, {});
  }
};
