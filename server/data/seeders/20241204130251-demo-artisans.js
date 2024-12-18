//server\data\seeders\20241204130251-demo-artisans.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tbl_artisans",
      [
        {
          id: 1,
          name: "Иван Иванов",
          note: "Опитен майстор",
          number: "123456789",
          email: "ivan@example.com",
          companyId: 1,
          user_id: 1,
          status: "active",
          activity_id: 68,
          measure_id: 1
        },
        {
          id: 2,
          name: "Петър Петров",
          note: "Нов в екипа",
          number: "987654321",
          email: "petar@example.com",
          companyId: 2,
          user_id: 2,
          status: "inactive",
          activity_id: 72,
          measure_id: 2
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_artisans", null, {});
  }
};
