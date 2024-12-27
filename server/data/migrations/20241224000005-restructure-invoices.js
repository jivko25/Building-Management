"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Restructuring invoices table...");

    // 1. Добавяме client_id колона
    await queryInterface.addColumn("tbl_invoices", "client_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_clients",
        key: "id"
      }
    });

    // 2. Актуализираме съществуващите записи (ако има такива)
    await queryInterface.sequelize.query(`
      UPDATE tbl_invoices 
      SET client_id = NULL 
      WHERE client_id IS NULL
    `);

    // 3. Премахваме client_company_id колона
    await queryInterface.removeColumn("tbl_invoices", "client_company_id");

    console.log("Invoices table restructured successfully!");
  },

  async down(queryInterface, Sequelize) {
    // 1. Добавяме обратно client_company_id
    await queryInterface.addColumn("tbl_invoices", "client_company_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_companies",
        key: "id"
      }
    });

    // 2. Премахваме client_id
    await queryInterface.removeColumn("tbl_invoices", "client_id");
  }
};
