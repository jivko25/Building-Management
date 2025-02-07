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
          registration_number: "BG123456789",
          location: "София",
          address: "ул. Примерна 1",
          mol: "MOL Георгиев",
          email: "contact@firma-a.com",
          phone: "0888123456",
          status: "active",
          logo_url: "https://i.imgur.com/rMsgj7l.png",
          vat_number: "BG123456789",
          iban: "BG123456789",
          creator_id: 2
        },
        {
          id: 2,

          name: "Строителна фирма Б",
          registration_number: "BG987654321",
          location: "Благоевград",
          address: "ул. Примерна 2",
          mol: "MOL Маринов",
          email: "contact@firma-b.com",
          phone: "0888765432",
          status: "inactive",
          logo_url: "https://i.imgur.com/hOXnDc6.png",
          vat_number: "BG123456789",
          iban: "BG123456789",
          creator_id: 2
        },
        {
          id: 3,

          name: "Строителна фирма В",
          registration_number: "BG123456789",
          location: "Пловдив",
          address: "ул. Примерна 3",
          mol: "MOL Иванов",
          email: "contact@firma-c.com",
          phone: "0888123456",
          status: "active",
          logo_url: "https://i.imgur.com/rMsgj7l.png",
          vat_number: "BG123456789",
          iban: "BG123456789",
          creator_id: 2
        },
        {
          id: 4,
          name: "Строителна фирма Г",
          registration_number: "BG123456789",
          location: "Бургас",
          address: "ул. Примерна 4",
          mol: "MOL Иванович",
          email: "contact@firma-d.com",
          phone: "0888123456",
          status: "active",
          logo_url: "https://i.imgur.com/hOXnDc6.png",
          vat_number: "BG123456789",
          iban: "BG123456789",
          creator_id: 2
        },
        {
          id: 5,
          name: "Строителна фирма Д",
          registration_number: "BG123456789",
          location: "Варна",
          address: "ул. Примерна 5",
          mol: "MOL Иванов",
          email: "contact@firma-d.com",
          phone: "0888123456",
          status: "active",
          logo_url: "https://i.imgur.com/rMsgj7l.png",
          vat_number: "BG123456789",
          iban: "BG123456789",
          creator_id: 1
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
