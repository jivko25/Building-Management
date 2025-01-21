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
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});
  }
};
