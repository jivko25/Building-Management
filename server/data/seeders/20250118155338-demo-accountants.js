module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tbl_accountants', [
      {
        name: 'Иван Иванов',
        note: 'Главен счетоводител',
        number: '+359888123456',
        email: 'ivan@example.com',
        company_id: 1,
        user_id: 1,
        status: 'active'
      },
      {
        name: 'Мария Петрова',
        note: 'Старши счетоводител',
        number: '+359887654321',
        email: 'maria@example.com',
        company_id: 2,
        user_id: 2,
        status: 'active'
      },
      {
        name: 'Георги Димитров',
        note: 'Младши счетоводител',
        number: '+359899999999',
        email: 'georgi@example.com',
        company_id: 1,
        user_id: 3,
        status: 'inactive'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tbl_accountants', null, {});
  }
};