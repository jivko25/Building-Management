module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_accountant_invoices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_invoices',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      accountant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_accountants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_accountant_invoices');
  }
};