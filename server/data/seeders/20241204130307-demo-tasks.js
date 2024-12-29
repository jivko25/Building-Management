//server\data\seeders\20241204130307-demo-tasks.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_tasks", null, {});

    await queryInterface.bulkInsert(
      "tbl_tasks",
      [
        { id: 1, project_id: 1, name: "Задача 1", activity_id: 68, measure_id: 1, price_per_measure: 10.0, total_price: 100.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка1", status: "active" },
        { id: 2, project_id: 2, name: "Задача 2", activity_id: 72, measure_id: 2, price_per_measure: 15.0, total_price: 150.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка2", status: "inactive" },
        { id: 3, project_id: 3, name: "Задача 3", activity_id: 73, measure_id: 1, price_per_measure: 20.0, total_price: 200.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка3", status: "active" },
        { id: 4, project_id: 4, name: "Задача 4", activity_id: 68, measure_id: 2, price_per_measure: 25.0, total_price: 250.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка4", status: "inactive" },
        { id: 5, project_id: 5, name: "Задача 5", activity_id: 72, measure_id: 1, price_per_measure: 30.0, total_price: 300.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка5", status: "active" }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_tasks", null, {});
  }
};
