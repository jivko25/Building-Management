//server\data\migrations\20241205000000-add-activity-measure-to-artisans.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_artisans", "activity_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_activities",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });

    await queryInterface.addColumn("tbl_artisans", "measure_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_measures",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_artisans", "activity_id");
    await queryInterface.removeColumn("tbl_artisans", "measure_id");
  }
};
