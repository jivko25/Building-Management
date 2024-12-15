//server\data\seeders\20241204130204-demo-activities.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tbl_activities",
      [
        { id: 68, name: "Шпакловка", status: "active" },
        { id: 72, name: "Саниране", status: "active" },
        { id: 73, name: "Лене на бетон", status: "active" }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_activities", null, {});
  }
};
