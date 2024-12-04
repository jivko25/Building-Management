'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_workitems', [
      { id: 1, task_id: 1, name: 'Работен елемент 1', start_date: new Date(), end_date: null, note: 'Забележка', finished_work: 'Завършена работа', status: 'in_progress' },
      { id: 2, task_id: 2, name: 'Работен елемент 2', start_date: new Date(), end_date: null, note: 'Забележка', finished_work: 'Завършена работа', status: 'done' }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_workitems', null, {});
  }
};