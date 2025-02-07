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
      registration_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location: {
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
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive"
      },
      iban: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vat_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "tbl_companies",
      timestamps: false
    }

  );

  Company.associate = models => {
    Company.hasMany(models.Project, {
      foreignKey: "company_id",
      as: "projects"
    });

    Company.hasMany(models.Artisan, {
      foreignKey: "company_id",
      as: "artisans"
    });

    Company.hasMany(models.Invoice, {
      foreignKey: "company_id",
      as: "invoices"
    });
  };

  return Company;
};
