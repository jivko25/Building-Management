//server\data\models\Artisan.js
module.exports = (sequelize, DataTypes) => {
  const Artisan = sequelize.define(
    "Artisan",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_companies",
          key: "id"
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_users",
          key: "id"
        }
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive"
      },
      activity_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_activities",
          key: "id"
        }
      },
      measure_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_measures",
          key: "id"
        }
      }
    },
    {
      tableName: "tbl_artisans",
      timestamps: false
    }
  );

  Artisan.associate = models => {
    Artisan.belongsTo(models.Company, {
      foreignKey: "companyId",
      as: "company"
    });

    Artisan.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });

    Artisan.belongsToMany(models.Task, {
      through: "tbl_task_artisans",
      foreignKey: "artisan_id",
      otherKey: "task_id",
      as: "tasks"
    });

    Artisan.belongsTo(models.Activity, {
      foreignKey: "activity_id",
      as: "activity"
    });

    Artisan.belongsTo(models.Measure, {
      foreignKey: "measure_id",
      as: "measure"
    });
  };

  return Artisan;
};
