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
        price: {
          type: DataTypes.FLOAT,
          allowNull: false
        },    
      },
      {
        tableName: "tbl_default_pricing",
        timestamps: false
      }
    );
  
    DefaultPricing.associate = models => {
      DefaultPricing.hasMany(models.Activity, {
        foreignKey: "activity_id",
        as: "activity"
      });
      DefaultPricing.hasMany(models.Measure, {
        foreignKey: "measure_id",
        as: "measure"
      });
      DefaultPricing.hasMany(models.Artisan, {
        foreignKey: "artisan_id",
        as: "artisan"
      });
    };
  
    return DefaultPricing;
  };
  