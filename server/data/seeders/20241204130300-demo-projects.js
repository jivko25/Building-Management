//server\data\seeders\20241204130300-demo-projects.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Seeding projects...");
    await queryInterface.bulkInsert(
      "tbl_projects",
      [
        {
          id: 1,
          name: "Проект А",
          companyId: 1,
          company_name: "Строителна фирма А",
          email: "projecta@example.com",
          address: "ул. Проектна 1",
          start_date: new Date(),
          end_date: null,
          note: "Важен проект",
          status: "active",
          creator_id: 1
        },
        {
          id: 2,
          name: "Проект Б",
          companyId: 2,
          company_name: "Строителна фирма Б",
          email: "projectb@example.com",
          address: "ул. Проектна 2",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        }
      ],
      {}
    );
    console.log("Projects seeded successfully!");
  },

  async down(queryInterface, Sequelize) {
    console.log("Removing seeded projects...");
    await queryInterface.bulkDelete("tbl_projects", null, {});
    console.log("Seeded projects removed successfully!");
  }
};
