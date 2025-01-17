//server/data/models/TasksArtisans.js
module.exports = (sequelize, DataTypes) => {
  const TaskArtisan = sequelize.define("TasksArtisan", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_tasks",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      artisan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_artisans",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "tbl_task_artisans",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['task_id', 'artisan_id']
        }
      ]
    }
  );

  TaskArtisan.associate = models => {
    TaskArtisan.belongsTo(models.Task, {
      foreignKey: "task_id",
      as: "task"
    });

    TaskArtisan.belongsTo(models.Artisan, {
      foreignKey: "artisan_id",
      as: "artisan"
    });
  };

  return TaskArtisan;
};
