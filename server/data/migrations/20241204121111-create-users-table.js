//server\data\migrations\20241204123816-create-users-table.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      manager_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      terms: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      user_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      }
    });
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_users");
  }
};
