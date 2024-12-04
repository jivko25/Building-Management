'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_tasks', [
      { id: 1, project_id: 1, name: 'Задача 1', artisan_id: 1, activity_id: 68, measure_id: 1, price_per_measure: 10.00, total_price: 100.00, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: 'Забележка', status: 'active' },
      { id: 2, project_id: 2, name: 'Задача 2', artisan_id: 2, activity_id: 72, measure_id: 2, price_per_measure: 15.00, total_price: 150.00, total_work_in_selected_measure: 10, start_date: new Date(), end_date: null, note: 'Забележка', status: 'inactive' }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_tasks', null, {});
  }
};