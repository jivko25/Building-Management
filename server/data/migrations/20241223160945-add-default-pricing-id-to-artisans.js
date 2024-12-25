'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_artisans', 'default_pricing_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_default_pricing',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_artisans', 'default_pricing_id');
  }
};
