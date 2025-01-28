module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_task_accountants', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_tasks',
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
    await queryInterface.dropTable('tbl_task_accountants');
  }
};