//server\data\models\Measure.js
module.exports = (sequelize, DataTypes) => {
  const Measure = sequelize.define(
    "Measure",
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
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_users",
          key: "id"
        }
      }
    },
    {
      tableName: "tbl_measures",
      timestamps: false
    }
  );

  Measure.associate = models => {
    Measure.hasMany(models.Task, {
      foreignKey: "measure_id",
      as: "tasks"
    });
  };

  return Measure;
};
