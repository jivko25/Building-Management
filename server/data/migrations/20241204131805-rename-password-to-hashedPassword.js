'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('tbl_users', 'password', 'hashedPassword');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('tbl_users', 'hashedPassword', 'password');
  }
};