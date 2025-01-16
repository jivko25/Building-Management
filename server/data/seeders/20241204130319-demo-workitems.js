//server\data\seeders\20241204130319-demo-workitems.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});

    await queryInterface.bulkInsert(
      "tbl_workitems",
      [
        // Група 1 - за занаятчия 1
        { id: 1, task_id: 1, project_id: 1, name: "Шпакловка стени", start_date: new Date(), end_date: null, activity_id: 1, measure_id: 1, artisan_id: 1, quantity: 10.0, note: "Шпакловка стени", finished_work: "Завършена работа", status: "done", is_client_invoiced: false, is_artisan_invoiced: false },
        { id: 2, task_id: 1, project_id: 1, name: "Шпакловка таван", start_date: new Date(), end_date: null, activity_id: 1, measure_id: 1, artisan_id: 1, quantity: 15.0, note: "Шпакловка таван", finished_work: "Завършена работа", status: "done", is_client_invoiced: false, is_artisan_invoiced: false },
        { id: 3, task_id: 1, project_id: 1, name: "Шпакловка коридор", start_date: new Date(), end_date: null, activity_id: 1, measure_id: 1, artisan_id: 1, quantity: 20.0, note: "Шпакловка коридор", finished_work: "Завършена работа", status: "done", is_client_invoiced: false, is_artisan_invoiced: false },

        // Група 2 - за занаятчия 2
        { id: 4, task_id: 1, project_id: 1, name: "Боядисване стени", start_date: new Date(), end_date: null, activity_id: 2, measure_id: 1, artisan_id: 2, quantity: 25.0, note: "Боядисване стени", finished_work: "Завършена работа", status: "done", is_client_invoiced: false, is_artisan_invoiced: false },
        { id: 5, task_id: 1, project_id: 1, name: "Боядисване таван", start_date: new Date(), end_date: null, activity_id: 2, measure_id: 1, artisan_id: 2, quantity: 30.0, note: "Боядисване таван", finished_work: "Завършена работа", status: "done", is_client_invoiced: false, is_artisan_invoiced: false },
        { id: 6, task_id: 1, project_id: 1, name: "Боядисване коридор", start_date: new Date(), end_date: null, activity_id: 2, measure_id: 1, artisan_id: 2, quantity: 35.0, note: "Боядисване коридор", finished_work: "Завършена работа", status: "done", is_client_invoiced: false, is_artisan_invoiced: false },

        // Група 3 - за занаятчия 3
        { id: 7, task_id: 1, project_id: 1, name: "Замазка стени", start_date: new Date(), end_date: null, activity_id: 3, measure_id: 1, artisan_id: 3, quantity: 40.0, note: "Замазка стени", finished_work: "Завършена работа", status: "done", is_client_invoiced: false, is_artisan_invoiced: false },
        { id: 8, task_id: 1, project_id: 1, name: "Замазка таван", start_date: new Date(), end_date: null, activity_id: 3, measure_id: 1, artisan_id: 3, quantity: 45.0, note: "Замазка таван", finished_work: "Завършена работа", status: "done", is_client_invoiced: false, is_artisan_invoiced: false },
        { id: 9, task_id: 1, project_id: 1, name: "Замазка коридор", start_date: new Date(), end_date: null, activity_id: 3, measure_id: 1, artisan_id: 3, quantity: 50.0, note: "Замазка коридор", finished_work: "Завършена работа", status: "done", is_client_invoiced: false, is_artisan_invoiced: false }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});
  }
};
