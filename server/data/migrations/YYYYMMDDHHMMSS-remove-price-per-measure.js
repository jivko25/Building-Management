"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_tasks", "price_per_measure");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_tasks", "price_per_measure", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  }
};
