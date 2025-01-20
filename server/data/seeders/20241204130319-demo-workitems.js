//server\data\seeders\20241204130319-demo-workitems.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});

    await queryInterface.bulkInsert(
      "tbl_workitems",
      [
        // Компания 1
        {
          id: 1,
          task_id: 1,
          project_id: 1,
          name: "Шпакловка стени",
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 1,
          measure_id: 1,
          artisan_id: 1,
          quantity: 10.0,
          note: "Шпакловка стени",
          finished_work: "Завършена работа",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false
        },
        {
          id: 2,
          task_id: 1,
          project_id: 1,
          name: "Шпакловка таван",
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 1,
          measure_id: 1,
          artisan_id: 1,
          quantity: 15.0,
          note: "Шпакловка таван",
          finished_work: "Завършена работа",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false
        },

        // Компания 2
        {
          id: 3,
          task_id: 2,
          project_id: 2,
          name: "Саниране фасада",
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 2,
          measure_id: 1,
          artisan_id: 2,
          quantity: 30.0,
          note: "Саниране фасада",
          finished_work: "Завършена работа",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false
        },
        {
          id: 4,
          task_id: 2,
          project_id: 2,
          name: "Саниране цокъл",
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 2,
          measure_id: 1,
          artisan_id: 2,
          quantity: 20.0,
          note: "Саниране цокъл",
          finished_work: "Завършена работа",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false
        },

        // Компания 3
        {
          id: 5,
          task_id: 3,
          project_id: 3,
          name: "Лене на бетон - основи",
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 3,
          measure_id: 2,
          artisan_id: 3,
          quantity: 25.0,
          note: "Лене на бетон - основи",
          finished_work: "Завършена работа",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false
        },

        // Компания 4
        {
          id: 6,
          task_id: 4,
          project_id: 4,
          name: "Шпакловка апартамент",
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 1,
          measure_id: 1,
          artisan_id: 4,
          quantity: 45.0,
          note: "Шпакловка апартамент",
          finished_work: "Завършена работа",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false
        },

        // Компания 5
        {
          id: 7,
          task_id: 5,
          project_id: 5,
          name: "Саниране сграда",
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 2,
          measure_id: 1,
          artisan_id: 5,
          quantity: 100.0,
          note: "Саниране сграда",
          finished_work: "Завършена работа",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false
        },

        // Още за Компания 1 (различен проект)
        {
          id: 8,
          task_id: 6,
          project_id: 6,
          name: "Шпакловка офис",
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 1,
          measure_id: 1,
          artisan_id: 1,
          quantity: 35.0,
          note: "Шпакловка офис",
          finished_work: "Завършена работа",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false
        },

        // Още за Компания 2 (различен проект)
        {
          id: 9,
          task_id: 7,
          project_id: 7,
          name: "Саниране гараж",
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 2,
          measure_id: 1,
          artisan_id: 2,
          quantity: 15.0,
          note: "Саниране гараж",
          finished_work: "Завършена работа",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});
  }
};
