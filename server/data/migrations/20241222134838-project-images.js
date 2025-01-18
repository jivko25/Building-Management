'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create tbl_project_images table
    await queryInterface.createTable('tbl_project_images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_projects',
          key: 'id'
        }
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // Drop tbl_project_images table
    await queryInterface.dropTable('tbl_project_images');
  }
};