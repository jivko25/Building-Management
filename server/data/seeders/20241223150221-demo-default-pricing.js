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
          artisan_price: 50.0,
          creator_id: 2,
          artisan_id: null
        },
        {
          id: 2,
          activity_id: 2,
          measure_id: 1,
          project_id: 1,
          manager_price: 150.0,
          artisan_price: 75.0,
          creator_id: 2,
          artisan_id: null
        },
        {
          id: 3,
          activity_id: 3,
          measure_id: 1,
          project_id: 1,
          manager_price: 200.0,
          artisan_price: 100.0,
          creator_id: 1,
          artisan_id: 1
        },
        {
          id: 4,
          activity_id: 1,
          measure_id: 2,
          project_id: 1,
          manager_price: 250.0,
          artisan_price: 125.0,
          creator_id: 2,
          artisan_id: 1
        },
        {
          id: 5,
          activity_id: 2,
          measure_id: 2,
          project_id: 1,
          manager_price: 300.0,
          artisan_price: 150.0,
          creator_id: 2,
          artisan_id: 2
        },
        {
          id: 6,
          activity_id: 3,
          measure_id: 2,
          project_id: 1,
          manager_price: 350.0,
          artisan_price: 175.0,
          creator_id: 2,
          artisan_id: 2
        },
        {
          id: 7,
          activity_id: 3,
          measure_id: 1,
          project_id: 1,
          manager_price: 220.0,
          artisan_price: 110.0,
          creator_id: 2,
          artisan_id: 2
        },
        {
          id: 8,
          activity_id: 3,
          measure_id: 2,
          project_id: 1,
          manager_price: 280.0,
          artisan_price: 140.0,
          creator_id: 2,
          artisan_id: 2
        }
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tbl_default_pricing", null, {});
  }
};
