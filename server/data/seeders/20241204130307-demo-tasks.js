//server\data\seeders\20241204130307-demo-tasks.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_tasks", null, {});

    await queryInterface.bulkInsert(
      "tbl_tasks",
      [
        { id: 1, project_id: 1, name: "Задача 1", activity_id: 1, measure_id: 1, total_price: 100.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка1", status: "active" },
        { id: 2, project_id: 2, name: "Задача 2", activity_id: 2, measure_id: 2, total_price: 150.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка2", status: "inactive" },
        { id: 3, project_id: 3, name: "Задача 3", activity_id: 3, measure_id: 1, total_price: 200.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка3", status: "active" },
        { id: 4, project_id: 4, name: "Задача 4", activity_id: 1, measure_id: 2, total_price: 250.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка4", status: "inactive" },
        { id: 5, project_id: 5, name: "Задача 5", activity_id: 2, measure_id: 1, total_price: 300.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка5", status: "active" },
        { id: 6, project_id: 1, name: "Задача 6", activity_id: 3, measure_id: 2, total_price: 350.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка6", status: "inactive" },
        { id: 7, project_id: 1, name: "Задача 7", activity_id: 1, measure_id: 1, total_price: 400.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка7", status: "active" },
        { id: 8, project_id: 2, name: "Задача 8", activity_id: 2, measure_id: 2, total_price: 450.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка8", status: "inactive" },
        { id: 9, project_id: 3, name: "Задача 9", activity_id: 3, measure_id: 1, total_price: 500.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка9", status: "active" },
        { id: 10, project_id: 6, name: "Задача 10", activity_id: 1, measure_id: 1, total_price: 500.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка10", status: "active" },
        { id: 11, project_id: 11, name: "Задача 11", activity_id: 2, measure_id: 1, total_price: 500.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка11", status: "active" },
        { id: 12, project_id: 13, name: "Задача 12", activity_id: 3, measure_id: 1, total_price: 500.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка12", status: "active" },
        { id: 13, project_id: 11, name: "Задача 13", activity_id: 1, measure_id: 1, total_price: 500.0, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: "Забележка13", status: "active" }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_tasks", null, {});
  }
};
