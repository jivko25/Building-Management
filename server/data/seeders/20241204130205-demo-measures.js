//server\data\seeders\20241204130233-demo-measures.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add check for existing measures
    const existing = await queryInterface.sequelize.query("SELECT id FROM tbl_measures WHERE name='hour'");

    if (existing[0].length === 0) {
      await queryInterface.bulkInsert("tbl_measures", [{ id: 1, name: "hour", creator_id: 1 }]);
    }

    await queryInterface.bulkInsert(
      "tbl_measures",
      [
        { id: 2, name: "Квадратен метър", creator_id: 2 },
        { id: 3, name: "Линеен метър", creator_id: 2 }
      ],
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_measures", null, {});
  }
};
