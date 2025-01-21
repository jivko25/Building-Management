module.exports = (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define(
    "InvoiceItem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_invoices",
          key: "id"
        }
      },
      work_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_workitems",
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
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      price_per_unit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    },
    {
      tableName: "tbl_invoice_items",
      timestamps: false
    }
  );

  InvoiceItem.associate = models => {
    InvoiceItem.belongsTo(models.Invoice, {
      foreignKey: "invoice_id",
      as: "invoice"
    });

    InvoiceItem.belongsTo(models.Activity, {
      foreignKey: "activity_id",
      as: "activity"
    });

    InvoiceItem.belongsTo(models.Measure, {
      foreignKey: "measure_id",
      as: "measure"
    });

    InvoiceItem.belongsTo(models.Project, {
      foreignKey: "project_id",
      as: "project"
    });

    InvoiceItem.belongsTo(models.Task, {
      foreignKey: "task_id",
      as: "task"
    });
  };

  return InvoiceItem;
};
