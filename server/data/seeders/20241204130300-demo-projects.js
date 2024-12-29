//server\data\seeders\20241204130300-demo-projects.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_projects", null, {});

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
          location: "София",
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
          location: "Варна",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 3,
          name: "Проект В",
          companyId: 3,
          company_name: "Строителна фирма В",
          email: "projectc@example.com",
          address: "ул. Проектна 3",
          location: "Пловдив",
          start_date: new Date(),
          end_date: null,
          note: "Важен проект",
          status: "active",
          creator_id: 1
        },
        {
          id: 4,
          name: "Проект Г",
          companyId: 4,
          company_name: "Строителна фирма Г",
          email: "projectd@example.com",
          address: "ул. Проектна 4",
          location: "Русе",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 5,
          name: "Проект Д",
          companyId: 5,
          company_name: "Строителна фирма Д",
          email: "projecte@example.com",
          address: "ул. Проектна 5",
          location: "Бургас",
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
