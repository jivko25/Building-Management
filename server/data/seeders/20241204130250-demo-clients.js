"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Първо намираме admin потребителя (знаем че ID е 1 от users сийдъра)
    await queryInterface.bulkInsert(
      "tbl_clients",
      [
        {
          id: 1,
          client_company_name: "Клиентска Фирма А",
          client_name: "Иван Иванов",
          client_company_address: "ул. Клиентска 1",
          client_company_iban: "BG98RZBB91550123456789",
          client_emails: JSON.stringify(["ivan@client-a.com", "office@client-a.com"]),
          status: "active",
          creator_id: 1, // Admin's ID
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          client_company_name: "Клиентска Фирма Б",
          client_name: "Петър Петров",
          client_company_address: "ул. Клиентска 2",
          client_company_iban: "BG987654321",
          client_emails: JSON.stringify(["petar@client-b.com"]),
          status: "active",
          creator_id: 2, // Manager's ID
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tbl_clients", null, {});
  }
};
