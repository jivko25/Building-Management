//server\data\migrations\20241204123915-create-projects-table.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Creating projects table...");
    await queryInterface.createTable("tbl_projects", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_companies",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "inactive"
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      }
    });
    console.log("Projects table created successfully!");
  },

  async down(queryInterface, Sequelize) {
    console.log("Dropping projects table...");
    await queryInterface.dropTable("tbl_projects");
    console.log("Projects table dropped successfully!");
  }
};
