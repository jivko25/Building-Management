//server\data\seeders\20241204130251-demo-artisans.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_artisans", null, {});

    await queryInterface.bulkInsert("tbl_artisans", [
      {
        id: 1,
        name: "Иван Иванов",
        note: "Опитен майстор",
        number: "123456789",
        email: "gogata1905@gmail.com",
        company_id: 1,
        user_id: 1,
        status: "active",
        activity_id: 1,
        measure_id: 1
      },
      {
        id: 2,
        name: "Петър Петров",
        note: "Нов в екипа",
        number: "987654321",
        email: "petar@example.com",
        company_id: 2,
        user_id: 2,
        status: "inactive",
        activity_id: 2,
        measure_id: 2
      },
      {
        id: 3,
        name: "Симеон Симеонов",
        note: "Опитен майстор",
        number: "123456789",
        email: "simeon@example.com",
        company_id: 2,
        user_id: 1,
        status: "active",
        activity_id: 3,
        measure_id: 1
      },
      {
        id: 4,
        name: "Георги Георгиев",
        note: "Нов в екипа",
        number: "987654321",
        email: "georgi@example.com",
        company_id: 2,
        user_id: 2,
        status: "inactive",
        activity_id: 3,
        measure_id: 2
      },
      {
        id: 5,
        name: "Иван Иванов",
        note: "Опитен майстор",
        number: "123456789",
        email: "ivan@example.com",
        company_id: 1,
        user_id: 2,
        status: "active",
        activity_id: 1,
        measure_id: 1
      }
    ]);
  },
 
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_artisans", null, {});
  }
};
