//server\data\seeders\20241204130214-demo-companies.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tbl_companies",
      [
        { id: 1, name: "Строителна фирма А", number: "BG123456789", address: "ул. Примерна 1", mol: "Георги Георгиев", email: "contact@firma-a.com", phone: "0888123456", dds: "yes", status: "active" },
        { id: 2, name: "Строителна фирма Б", number: "BG987654321", address: "ул. Примерна 2", mol: "Мария Маринова", email: "contact@firma-b.com", phone: "0888765432", dds: "no", status: "inactive" }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_companies", null, {});
  }
};
