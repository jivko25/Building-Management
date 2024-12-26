"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Creating clients table...");
    await queryInterface.createTable("tbl_clients", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      client_company_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      client_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      client_company_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      client_company_iban: {
        type: Sequelize.STRING,
        allowNull: true
      },
      client_emails: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
    console.log("Clients table created successfully!");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_clients");
  }
};
