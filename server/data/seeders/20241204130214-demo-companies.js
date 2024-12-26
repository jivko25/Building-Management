//server\data\seeders\20241204130214-demo-companies.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Seeding companies...");
    await queryInterface.bulkDelete("tbl_companies", null, {});

    await queryInterface.bulkInsert(
      "tbl_companies",
      [
        {
          id: 1,
          name: "Строителна фирма А",
          number: "BG123456789",
          address: "ул. Примерна 1",
          mol: "Георги Георгиев",
          email: "contact@firma-a.com",
          phone: "0888123456",
          dds: "yes",
          status: "active",
          logo_url: "https://i.imgur.com/rMsgj7l.png",
          vat_number: "BG123456789",
          iban: "BG123456789"
        },
        {
          id: 2,
          name: "Строителна фирма Б",
          number: "BG987654321",
          address: "ул. Примерна 2",
          mol: "Мария Маринова",
          email: "contact@firma-b.com",
          phone: "0888765432",
          dds: "no",
          status: "inactive",
          logo_url: "https://i.imgur.com/hOXnDc6.png",
          vat_number: "BG123456789",
          iban: "BG123456789"
        }
      ],
      {}
    );
    console.log("Companies seeded successfully!");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_companies", null, {});
  }
};
