//server\data\seeders\20241204130244-demo-users.js
"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const hashedAdminPassword = await bcrypt.hash("admin123", saltRounds);
    const hashedManagerPassword = await bcrypt.hash("manager123", saltRounds);
    const hashedUserPassword = await bcrypt.hash("user123", saltRounds);

    await queryInterface.bulkInsert(
      "tbl_users",
      [
        { id: 1, full_name: "Админ Админов", username: "admin", hashedPassword: hashedAdminPassword, role: "admin", status: "active", manager_id: null, creator_id: 1 },
        { id: 2, full_name: "Мениджър Мениджъров", username: "manager", hashedPassword: hashedManagerPassword, role: "manager", status: "active", manager_id: 1, creator_id: 1 },
        { id: 3, full_name: "Потребител Потребителов", username: "user", hashedPassword: hashedUserPassword, role: "user", status: "active", manager_id: 2, creator_id: 1 }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_users", null, {});
  }
};
