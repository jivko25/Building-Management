module.exports = (sequelize, DataTypes) => {
  const InvoiceLanguage = sequelize.define(
    "InvoiceLanguage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        type: DataTypes.STRING(2),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "tbl_invoice_languages",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return InvoiceLanguage;
};
