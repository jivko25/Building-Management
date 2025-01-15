"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "tbl_default_pricing",
      [
        {
          id: 1,
          activity_id: 1,
          measure_id: 1,
          project_id: 1,
          manager_price: 100.0,
          artisan_price: 50.0
        },
        {
          id: 2,
          activity_id: 2,
          measure_id: 2,
          project_id: 2,
          manager_price: 150.0,
          artisan_price: 75.0
        }
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tbl_default_pricing", null, {});
  }
};
