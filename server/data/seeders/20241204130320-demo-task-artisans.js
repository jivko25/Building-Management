//server/data/seeders/20241204130320-demo-task-artisans.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_task_artisans", null, {});

    await queryInterface.bulkInsert(
      "tbl_task_artisans",
      [
        {
          task_id: 1,
          artisan_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          task_id: 1,
          artisan_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          task_id: 2,
          artisan_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          task_id: 3,
          artisan_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          task_id: 4,
          artisan_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_task_artisans", null, {});
  }
};
