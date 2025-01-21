//server\data\seeders\20241204130251-demo-artisans.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_artisans", null, {});
    await queryInterface.bulkInsert("tbl_artisans", [
      {
        id: 1,
        name: "Майстор Майсторов",
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
        name: "Майстор Петров",
        note: "Нов в екипа",
        number: "987654321",
        email: "gogata1905@gmail.com",
        company_id: 2,
        user_id: 2,
        status: "inactive",
        activity_id: 2,
        measure_id: 2
      },
      {
        id: 3,
        name: "Майстор Симеонов",
        note: "Опитен майстор",
        number: "123456789",
        email: "gogata1905@gmail.com",
        company_id: 2,
        user_id: 1,
        status: "active",
        activity_id: 3,
        measure_id: 1
      },
      {
        id: 4,
        name: "Майстор Георгиев",
        note: "Нов в екипа",
        number: "987654321",
        email: "gogata1905@gmail.com",
        company_id: 2,
        user_id: 2,
        status: "inactive",
        activity_id: 3,
        measure_id: 2
      },
      {
        id: 5,
        name: "Майстор Иванов",
        note: "Опитен майстор",
        number: "123456789",
        email: "gogata1905@gmail.com",
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
