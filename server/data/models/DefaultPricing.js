//server\data\models\WorkItem.js
module.exports = (sequelize, DataTypes) => {
    const DefaultPricing = sequelize.define(
      "DefaultPricing",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
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
        project_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "tbl_projects",
            key: "id"
          }
        },
        creator_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "tbl_users",
            key: "id"
          }
        },
        artisan_price: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        manager_price: {
          type: DataTypes.FLOAT,
          allowNull: false
        }
      },
      {
        tableName: "tbl_default_pricing",
        timestamps: false
      }
    );
  
    DefaultPricing.associate = models => {
      DefaultPricing.belongsTo(models.Activity, {
        foreignKey: "activity_id",
        as: "activity"
      });
      DefaultPricing.belongsTo(models.Measure, {
        foreignKey: "measure_id",
        as: "measure"
      });
      DefaultPricing.belongsTo(models.Artisan, {
        foreignKey: "artisan_id",
        as: "artisan"
      });
    };
  
    return DefaultPricing;
  };