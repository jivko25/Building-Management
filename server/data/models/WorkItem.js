//server\data\models\WorkItem.js
module.exports = (sequelize, DataTypes) => {
  const WorkItem = sequelize.define(
    "WorkItem",
    {
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
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      finished_work: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM("done", "in_progress"),
        defaultValue: "in_progress"
      },
      is_client_invoiced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_artisan_invoiced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      activity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_activities",
          key: "id"
        }
      },
      measure_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_measures",
          key: "id"
        }
      },
      artisan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_artisans",
          key: "id"
        }
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    },
    {
      tableName: "tbl_workitems",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  WorkItem.associate = models => {
    WorkItem.belongsTo(models.Task, {
      foreignKey: "task_id",
      as: "task"
    });

    WorkItem.belongsTo(models.Activity, {
      foreignKey: "activity_id",
      as: "activity"
    });

    WorkItem.belongsTo(models.Measure, {
      foreignKey: "measure_id",
      as: "measure"
    });

    WorkItem.belongsTo(models.Artisan, {
      foreignKey: "artisan_id",
      as: "artisan"
    });
  };

  return WorkItem;
};
