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
        allowNull: true,
        references: {
          model: "tbl_clients",
          key: "id"
        }
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
      },
      is_artisan_invoice: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      artisan_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_artisans",
          key: "id"
        }
      },
      due_date_weeks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "Due date in weeks"
      }
    },
    {
      tableName: "tbl_invoices",
      underscored: true
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

    Invoice.belongsTo(models.Artisan, {
      foreignKey: "artisan_id",
      as: "artisan"
    });
  };

  return Invoice;
};
