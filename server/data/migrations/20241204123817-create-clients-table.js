"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active"
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_users",
          key: "id"
        }
      },
      client_company_vat_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      due_date: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 7,
        comment: "Number of days for invoice due date"
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tbl_clients");
  }
};
