//server\data\models\Activity.js
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    "Activity",
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
      status: {
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
      tableName: "tbl_activities",
      timestamps: false
    }
  );

  Activity.associate = models => {
    Activity.hasMany(models.Task, {
      foreignKey: "activity_id",
      as: "tasks"
    });
  };


  return Activity;
};
