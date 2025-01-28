module.exports = (sequelize, DataTypes) => {
    const TaskAccountant = sequelize.define(
      "TaskAccountant",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        task_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        accountant_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
      },
      {
        tableName: "tbl_task_accountants",
        timestamps: false
      }
    );
  
    TaskAccountant.associate = models => {
      TaskAccountant.belongsTo(models.Task, {
        foreignKey: "task_id",
        as: "task"
      });
  
      TaskAccountant.belongsTo(models.Accountant, {
        foreignKey: "accountant_id",
        as: "accountant"
      });
    };
  
    return TaskAccountant;
  };
  