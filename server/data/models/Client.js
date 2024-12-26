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
      }
    },
    {
      tableName: "tbl_clients",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return Client;
};
