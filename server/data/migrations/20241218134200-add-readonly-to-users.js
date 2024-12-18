'use strict';
module.exports = {
 up: async (queryInterface, Sequelize) => {
   await queryInterface.addColumn('tbl_users', 'readonly', {
     type: Sequelize.BOOLEAN,
     allowNull: true,
     defaultValue: false
   });
 },
  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('tbl_users', 'readonly');
 }
};