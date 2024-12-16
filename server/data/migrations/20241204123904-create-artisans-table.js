//server\data\migrations\20241204123904-create-artisans-table.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_artisans", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "inactive"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_artisans");
  }
};
