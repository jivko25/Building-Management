// seeders/XXXXXX-add-default-pricing-to-artisans.js
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: 1 }, { id: 1 });
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: 2 }, { id: 2 });
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: 3 }, { id: 3 });
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: 4 }, { id: 4 });
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: 5 }, { id: 5 });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: null }, { id: 1 });
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: null }, { id: 2 });
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: null }, { id: 3 });
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: null }, { id: 4 });
    await queryInterface.bulkUpdate("tbl_artisans", { default_pricing_id: null }, { id: 5 });
  }
};
