"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Creating invoices table...");
    await queryInterface.createTable("tbl_invoices", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      week_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_companies",
          key: "id"
        }
      },
      client_company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_companies",
          key: "id"
        }
      },
      invoice_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: Sequelize.ENUM("active", "cancelled"),
        defaultValue: "active"
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
    console.log("Invoices table created successfully!");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_invoices");
  }
};
