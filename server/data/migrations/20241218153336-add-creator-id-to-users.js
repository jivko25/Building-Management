"use strict";
module.exports = {
 async up(queryInterface, Sequelize) {
   await queryInterface.addColumn("tbl_users", "creator_id", {
     type: Sequelize.INTEGER,
     allowNull: true,
     references: {
       model: "tbl_users",
       key: "id"
     },
     onUpdate: "CASCADE",
     onDelete: "SET NULL"
   });
 },
  async down(queryInterface, Sequelize) {
   await queryInterface.removeColumn("tbl_users", "creator_id");
 }
};