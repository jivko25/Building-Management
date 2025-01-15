//server\data\seeders\20241204130319-demo-workitems.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});

    await queryInterface.bulkInsert(
      "tbl_workitems",
      [
        { id: 1, task_id: 1, name: "Работен елемент 1", start_date: new Date(), end_date: null, activity_id: 1, measure_id: 1, artisan_id: 1, quantity: 11.0, manager_price: 110.0, artisan_price: 80.0, note: "Забележка1", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 2, task_id: 2, name: "Работен елемент 2", start_date: new Date(), end_date: null, activity_id: 3, measure_id: 1, artisan_id: 1, quantity: 12.0, manager_price: 120.0, artisan_price: 70.0, note: "Забележка2", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 3, task_id: 3, name: "Работен елемент 3", start_date: new Date(), end_date: null, activity_id: 1, measure_id: 2, artisan_id: 1, quantity: 13.0, manager_price: 130.0, artisan_price: 100.0, note: "Забележка3", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 4, task_id: 4, name: "Работен елемент 4", start_date: new Date(), end_date: null, activity_id: 2, measure_id: 1, artisan_id: 2, quantity: 14.0, manager_price: 140.0, artisan_price: 60.0, note: "Забележка4", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 5, task_id: 5, name: "Работен елемент 5", start_date: new Date(), end_date: null, activity_id: 1, measure_id: 1, artisan_id: 3, quantity: 15.0, manager_price: 150.0, artisan_price: 100.0, note: "Забележка5", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 6, task_id: 1, name: "Работен елемент 6", start_date: new Date(), end_date: null, activity_id: 3, measure_id: 2, artisan_id: 3, quantity: 16.0, manager_price: 160.0, artisan_price: 110.0, note: "Забележка6", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 7, task_id: 1, name: "Работен елемент 7", start_date: new Date(), end_date: null, activity_id: 1, measure_id: 1, artisan_id: 3, quantity: 17.0, manager_price: 100.0, artisan_price: 60.0, note: "Забележка7", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 8, task_id: 2, name: "Работен елемент 8", start_date: new Date(), end_date: null, activity_id: 2, measure_id: 2, artisan_id: 4, quantity: 10.0, manager_price: 180.0, artisan_price: 130.0, note: "Забележка8", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 9, task_id: 3, name: "Работен елемент 9", start_date: new Date(), end_date: null, activity_id: 1, measure_id: 1, artisan_id: 4, quantity: 19.0, manager_price: 190.0, artisan_price: 140.0, note: "Забележка9", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 10, task_id: 10, name: "Работен елемент 10", start_date: new Date(), end_date: null, activity_id: 2, measure_id: 2, artisan_id: 4, quantity: 20.0, manager_price: 200.0, artisan_price: 150.0, note: "Забележка10", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 11, task_id: 11, name: "Работен елемент 11", start_date: new Date(), end_date: null, activity_id: 1, measure_id: 1, artisan_id: 5, quantity: 21.0, manager_price: 210.0, artisan_price: 160.0, note: "Забележка11", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 12, task_id: 12, name: "Работен елемент 12", start_date: new Date(), end_date: null, activity_id: 3, measure_id: 2, artisan_id: 5, quantity: 22.0, manager_price: 220.0, artisan_price: 170.0, note: "Забележка12", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 13, task_id: 13, name: "Работен елемент 13", start_date: new Date(), end_date: null, activity_id: 2, measure_id: 2, artisan_id: 5, quantity: 23.0, manager_price: 230.0, artisan_price: 180.0, note: "Забележка13", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});
  }
};
