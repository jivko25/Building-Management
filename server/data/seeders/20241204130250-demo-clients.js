"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log("Seeding clients...");
    await queryInterface.bulkInsert(
      "tbl_clients",
      [
        {
          id: 1,
          client_company_name: "Клиентска Фирма А",
          client_name: "Иван Иванов",
          client_company_address: "ул. Клиентска 1",
          client_company_iban: "BG98RZBB91550123456789",
          client_emails: JSON.stringify(["gogata1905@gmail.com", "gogata1905@abv.bg"]),
          status: "active",
          creator_id: 1,
          client_company_vat_number: "2252562636",
          invoice_language_id: 1, // English
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          client_company_name: "Клиентска Фирма Б",
          client_name: "Петър Петров",
          client_company_address: "ул. Клиентска 2",
          client_company_iban: "BG987654321",
          client_emails: JSON.stringify(["gogata1905@gmail.com", "gogata1905@abv.bg"]),
          status: "active",
          creator_id: 2, // Manager's ID
          client_company_vat_number: "2252562636",
          invoice_language_id: 2, // Bulgarian
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          client_company_name: "Клиентска Фирма В",
          client_name: "Симеон Симеонов",
          client_company_address: "ул. Клиентска 3",
          client_company_iban: "BG987654321",
          client_emails: JSON.stringify(["gogata1905@gmail.com", "gogata1905@abv.bg"]),
          status: "active",
          creator_id: 2, // Manager's ID
          client_company_vat_number: "2252562636",
          invoice_language_id: 3, // Romanian
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 4,
          client_company_name: "Клиентска Фирма Г",
          client_name: "Георги Георгиев",
          client_company_address: "ул. Клиентска 4",
          client_company_iban: "BG987654321",
          client_emails: JSON.stringify(["gogata1905@gmail.com", "gogata1905@abv.bg"]),
          status: "active",
          creator_id: 2, // Manager's ID
          client_company_vat_number: "2252562636",
          invoice_language_id: 4, // Russian
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 5,
          client_company_name: "Клиентска Фирма Д",
          client_name: "Иван Иванов",
          client_company_address: "ул. Клиентска 5",
          client_company_iban: "BG987654321",
          client_emails: JSON.stringify(["gogata1905@gmail.com", "gogata1905@abv.bg"]),
          status: "active",
          creator_id: 2, // Manager's ID
          client_company_vat_number: "2252562636",
          invoice_language_id: 5, // Turkish
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
    console.log("Clients seeded successfully!");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tbl_clients", null, {});
  }
};
