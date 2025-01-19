module.exports = (sequelize, DataTypes) => {
    const AccountantInvoice = sequelize.define(
      "AccountantInvoice",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        invoice_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        accountant_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
      },
      {
        tableName: "tbl_accountant_invoices",
        timestamps: false
      }
    );
  
    AccountantInvoice.associate = models => {
      AccountantInvoice.belongsTo(models.Invoice, {
        foreignKey: "invoice_id",
        as: "invoice"
      });
  
      AccountantInvoice.belongsTo(models.Accountant, {
        foreignKey: "accountant_id",
        as: "accountant"
      });
    };
  
    return AccountantInvoice;
  };
  