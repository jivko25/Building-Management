//server\data\seeders\20241204130204-demo-activities.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_activities", null, {});

    await queryInterface.bulkInsert(
      "tbl_activities",
      [
        { id: 1, name: "Шпакловка", status: "active" },
        { id: 2, name: "Саниране", status: "active" },
        { id: 3, name: "Лене на бетон", status: "active" }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_activities", null, {});
  }
};
