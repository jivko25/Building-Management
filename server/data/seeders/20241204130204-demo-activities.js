//server\data\seeders\20241204130204-demo-activities.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_activities", null, {});

    await queryInterface.bulkInsert(
      "tbl_activities",
      [
        { id: 68, name: "Шпакловка", status: "active", creator_id: 2 },
        { id: 72, name: "Саниране", status: "active", creator_id: 2 },
        { id: 73, name: "Лене на бетон", status: "active", creator_id: 1 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_activities", null, {});
  }
};
