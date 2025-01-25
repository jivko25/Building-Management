//server\data\seeders\20241204130233-demo-measures.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_measures", null, {});
    
    await queryInterface.bulkInsert(
      "tbl_measures",
      [
        { id: 1, name: "hour", creator_id: 1},
        { id: 2, name: "Квадратен метър", creator_id: 2 },
        { id: 3, name: "Линеен метър", creator_id: 2 }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_measures", null, {});
  }
};
