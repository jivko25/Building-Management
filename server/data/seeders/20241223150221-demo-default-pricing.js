'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tbl_default_pricing', [
      {
        id: 1,
        activity_id: 68,
        measure_id: 1,
        artisan_id: 1,
        project_id: 1,
        creator_id: 1,
        artisan_price: 100.0,
        manager_price: 150.0
      },
      {
        id: 2,
        activity_id: 72,
        measure_id: 2,
        artisan_id: 2,
        project_id: 1,
        creator_id: 1,
        artisan_price: 150.0,
        manager_price: 200.0
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tbl_default_pricing', null, {});
  }
};