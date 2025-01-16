"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log("Seeding invoice languages...");
    await queryInterface.bulkInsert(
      "tbl_invoice_languages",
      [
        { id: 1, code: "en", name: "English", created_at: new Date(), updated_at: new Date() },
        { id: 2, code: "bg", name: "Bulgarian", created_at: new Date(), updated_at: new Date() },
        { id: 3, code: "ro", name: "Romanian", created_at: new Date(), updated_at: new Date() },
        { id: 4, code: "ru", name: "Russian", created_at: new Date(), updated_at: new Date() },
        { id: 5, code: "tr", name: "Turkish", created_at: new Date(), updated_at: new Date() },
        { id: 6, code: "pl", name: "Polish", created_at: new Date(), updated_at: new Date() },
        { id: 7, code: "nl", name: "Dutch", created_at: new Date(), updated_at: new Date() },
        { id: 8, code: "de", name: "German", created_at: new Date(), updated_at: new Date() }
      ],
      {}
    );
    console.log("Invoice languages seeded successfully!");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tbl_invoice_languages", null, {});
  }
};
