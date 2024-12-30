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
          company_id: 1,
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
          company_id: 2,
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
          company_id: 3,
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
          company_id: 4,
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
          company_id: 5,
          company_name: "Строителна фирма Д",
          email: "projecte@example.com",
          address: "ул. Проектна 5",
          location: "Бургас",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 6,
          name: "Проект Е",
          company_id: 1,
          company_name: "Строителна фирма Е",
          email: "projectf@example.com",
          address: "ул. Проектна 6",
          location: "София",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 7,
          name: "Проект Ж",
          company_id: 2,
          company_name: "Строителна фирма Ж",
          email: "projectg@example.com",
          address: "ул. Проектна 7",
          location: "София",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 8,
          name: "Проект З",
          company_id: 3,
          company_name: "Строителна фирма З",
          email: "projecth@example.com",
          address: "ул. Проектна 8",
          location: "София",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 9,
          name: "Проект И",
          company_id: 4,
          company_name: "Строителна фирма И",
          email: "projecti@example.com",
          address: "ул. Проектна 9",
          location: "София",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 10,
          name: "Проект К",
          company_id: 5,
          company_name: "Строителна фирма К",
          email: "projectj@example.com",
          address: "ул. Проектна 10",
          location: "София",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 11,
          name: "Проект Л",
          company_id: 1,
          company_name: "Строителна фирма Л",
          email: "projectk@example.com",
          address: "ул. Проектна 11",
          location: "София",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 12,
          name: "Проект М",
          company_id: 2,
          company_name: "Строителна фирма М",
          email: "projectm@example.com",
          address: "ул. Проектна 12",
          location: "София",
          start_date: new Date(),
          end_date: null,
          note: "Малък проект",
          status: "inactive",
          creator_id: 1
        },
        {
          id: 13,
          name: "Проект Н",
          company_id: 1,
          company_name: "Строителна фирма Н",
          email: "projectn@example.com",
          address: "ул. Проектна 13",
          location: "София",
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
