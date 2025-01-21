//server\data\migrations\20241204123915-create-projects-table.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Creating projects table...");
    await queryInterface.createTable("tbl_projects", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "ID of the project"
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Name of the project"
      },
      company_id: {
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
        allowNull: true,
        comment: "Name of the company"
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Email of the project"
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Address of the project"
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "City location of the project"
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Start date of the project"
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "End date of the project"
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Note of the project"
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "inactive",
        comment: "Status of the project"
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_clients",
          key: "id"
        }
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
