//server\data\seeders\20241204130319-demo-workitems.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});

    await queryInterface.bulkInsert(
      "tbl_workitems",
      [
        { id: 1, task_id: 1, name: "Работен елемент 1", start_date: new Date(), end_date: null, note: "Забележка1", finished_work: "Завършена работа", status: "in_progress" },
        { id: 2, task_id: 2, name: "Работен елемент 2", start_date: new Date(), end_date: null, note: "Забележка2", finished_work: "Завършена работа", status: "done" },
        { id: 3, task_id: 3, name: "Работен елемент 3", start_date: new Date(), end_date: null, note: "Забележка3", finished_work: "Завършена работа", status: "in_progress" },
        { id: 4, task_id: 4, name: "Работен елемент 4", start_date: new Date(), end_date: null, note: "Забележка4", finished_work: "Завършена работа", status: "done" },
        { id: 5, task_id: 5, name: "Работен елемент 5", start_date: new Date(), end_date: null, note: "Забележка5", finished_work: "Завършена работа", status: "in_progress" }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});
  }
};
