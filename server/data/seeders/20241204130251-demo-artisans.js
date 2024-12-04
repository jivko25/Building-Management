'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_artisans', [
      { id: 1, name: 'Иван Иванов', note: 'Опитен майстор', number: '123456789', email: 'ivan@example.com', company_id: 1, user_id: 1, status: 'active' },
      { id: 2, name: 'Петър Петров', note: 'Нов в екипа', number: '987654321', email: 'petar@example.com', company_id: 2, user_id: 2, status: 'inactive' }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_artisans', null, {});
  }
};