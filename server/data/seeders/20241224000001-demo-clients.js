"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_clients", null, {});

    await queryInterface.bulkInsert(
      "tbl_clients",
      [
        {
          id: 1,
          client_company_name: "Клиентска Фирма А",
          client_name: "Иван Иванов",
          client_company_address: "ул. Клиентска 1",
          client_company_iban: "BG98RZBB91550123456789",
          client_emails: JSON.stringify(["ivan@client-a.com", "office@client-a.com"])
        },
        {
          id: 2,
          client_name: "Петър Петров",
          client_emails: JSON.stringify(["petar@gmail.com"])
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_clients", null, {});
  }
};
