//server\data\seeders\20241204130204-demo-activities.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_activities", null, {});

    await queryInterface.bulkInsert(
      "tbl_activities",
      [
        { id: 1, name: "Hour", status: "active", creator_id: 1 },
        { id: 2, name: "Шпакловка", status: "active", creator_id: 1 },
        { id: 3, name: "Саниране", status: "active", creator_id: 2 },
        { id: 4, name: "Лене на бетон", status: "active", creator_id: 2 }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_activities", null, {});
  }
};
