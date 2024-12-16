//server\data\models\Company.js
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
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
      number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mol: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dds: {
        type: DataTypes.ENUM("yes", "no"),
        defaultValue: "no"
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive"
      }
    },
    {
      tableName: "tbl_companies",
      timestamps: false
    }
  );

  Company.associate = models => {
    Company.hasMany(models.Project, {
      foreignKey: "companyId",
      as: "projects"
    });

    Company.hasMany(models.Artisan, {
      foreignKey: "companyId",
      as: "artisans"
    });
  };

  return Company;
};
