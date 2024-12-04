'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_projects', [
      { id: 1, name: 'Проект А', company_id: 1, email: 'projecta@example.com', address: 'ул. Проектна 1', start_date: new Date(), end_date: null, note: 'Важен проект', status: 'active' },
      { id: 2, name: 'Проект Б', company_id: 2, email: 'projectb@example.com', address: 'ул. Проектна 2', start_date: new Date(), end_date: null, note: 'Малък проект', status: 'inactive' }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_projects', null, {});
  }
};