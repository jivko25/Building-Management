module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      invoice_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      week_number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      invoice_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      tableName: "tbl_invoices",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  Invoice.associate = models => {
    Invoice.belongsTo(models.Company, {
      foreignKey: "company_id",
      as: "company"
    });

    Invoice.belongsTo(models.Client, {
      foreignKey: "client_id",
      as: "client"
    });

    Invoice.hasMany(models.InvoiceItem, {
      foreignKey: "invoice_id",
      as: "items"
    });
  };

  return Invoice;
};
