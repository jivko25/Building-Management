"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_default_pricing", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_activities",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      measure_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_measures",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
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
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      artisan_price: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      manager_price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      artisan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_artisans",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tbl_default_pricing");
  }
};
