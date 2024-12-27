"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_companies", "iban", {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn("tbl_companies", "vat_number", {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn("tbl_companies", "logo_url", {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_companies", "iban");
    await queryInterface.removeColumn("tbl_companies", "vat_number");
    await queryInterface.removeColumn("tbl_companies", "logo_url");
  }
};
