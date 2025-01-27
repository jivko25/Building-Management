"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("tbl_projects", "created_at", {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn("tbl_projects", "updated_at", {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Задаваме текуща дата за съществуващите записи
    await queryInterface.sequelize.query(`
      UPDATE tbl_projects 
      SET created_at = CURRENT_TIMESTAMP, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE created_at IS NULL
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("tbl_projects", "created_at");
    await queryInterface.removeColumn("tbl_projects", "updated_at");
  }
};
