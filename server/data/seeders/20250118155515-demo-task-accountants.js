module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tbl_task_accountants', [
      {
        task_id: 1,
        accountant_id: 1
      },
      {
        task_id: 2,
        accountant_id: 1
      },
      {
        task_id: 3,
        accountant_id: 2
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tbl_task_accountants', null, {});
  }
};