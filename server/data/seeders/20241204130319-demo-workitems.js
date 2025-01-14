//server\data\seeders\20241204130319-demo-workitems.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});

    await queryInterface.bulkInsert(
      "tbl_workitems",
      [
        { id: 1, task_id: 1, name: "Работен елемент 1", start_date: new Date(), end_date: null, note: "Забележка1", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 2, task_id: 2, name: "Работен елемент 2", start_date: new Date(), end_date: null, note: "Забележка2", finished_work: "Завършена работа", status: "done", isInvoiced: false },
        { id: 3, task_id: 3, name: "Работен елемент 3", start_date: new Date(), end_date: null, note: "Забележка3", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 4, task_id: 4, name: "Работен елемент 4", start_date: new Date(), end_date: null, note: "Забележка4", finished_work: "Завършена работа", status: "done", isInvoiced: false },
        { id: 5, task_id: 5, name: "Работен елемент 5", start_date: new Date(), end_date: null, note: "Забележка5", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 6, task_id: 1, name: "Работен елемент 6", start_date: new Date(), end_date: null, note: "Забележка6", finished_work: "Завършена работа", status: "done", isInvoiced: false },
        { id: 7, task_id: 1, name: "Работен елемент 7", start_date: new Date(), end_date: null, note: "Забележка7", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 8, task_id: 2, name: "Работен елемент 8", start_date: new Date(), end_date: null, note: "Забележка8", finished_work: "Завършена работа", status: "done", isInvoiced: false },
        { id: 9, task_id: 3, name: "Работен елемент 9", start_date: new Date(), end_date: null, note: "Забележка9", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false },
        { id: 10, task_id: 10, name: "Работен елемент 10", start_date: new Date(), end_date: null, note: "Забележка10", finished_work: "Завършена работа", status: "done", isInvoiced: false },
        { id: 11, task_id: 11, name: "Работен елемент 11", start_date: new Date(), end_date: null, note: "Забележка11", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false  },
        { id: 12, task_id: 12, name: "Работен елемент 12", start_date: new Date(), end_date: null, note: "Забележка12", finished_work: "Завършена работа", status: "done", isInvoiced: false },
        { id: 13, task_id: 13, name: "Работен елемент 13", start_date: new Date(), end_date: null, note: "Забележка13", finished_work: "Завършена работа", status: "in_progress", isInvoiced: false }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});
  }
};
