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
      company_id: {
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
      }
    },
    {
      tableName: "tbl_artisans",
      timestamps: false
    }
  );

  Artisan.associate = models => {
    Artisan.belongsTo(models.Company, {
      foreignKey: "company_id",
      as: "company"
    });

    Artisan.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });

    Artisan.hasMany(models.Task, {
      foreignKey: "artisan_id",
      as: "tasks"
    });
  };

  return Artisan;
};
