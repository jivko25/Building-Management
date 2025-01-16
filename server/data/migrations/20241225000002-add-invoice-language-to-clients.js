"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("tbl_clients", "invoice_language_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // English by default
      references: {
        model: "tbl_invoice_languages",
        key: "id"
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("tbl_clients", "invoice_language_id");
  }
};
