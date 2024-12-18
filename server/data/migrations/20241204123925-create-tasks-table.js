//server\data\migrations\20241204123925-create-tasks-table.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_tasks", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_projects",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      activity_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_activities",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      measure_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_measures",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      price_per_measure: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      total_work_in_selected_measure: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
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
        defaultValue: "active"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_tasks");
  }
};
