module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      client_company_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      client_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      client_company_address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      client_company_iban: {
        type: DataTypes.STRING,
        allowNull: true
      },
      client_emails: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active"
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      client_company_vat_number: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "tbl_clients",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  Client.associate = models => {
    Client.belongsTo(models.User, {
      foreignKey: "creator_id",
      as: "creator"
    });
    Client.hasMany(models.Invoice, {
      foreignKey: "client_id",
      as: "invoices"
    });
  };

  return Client;
};
