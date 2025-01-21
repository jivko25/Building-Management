module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_accountants', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tbl_companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tbl_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'inactive'
      },
      measure_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tbl_measures',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_accountants');
  }
};