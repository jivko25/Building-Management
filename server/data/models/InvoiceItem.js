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
        allowNull: false
      },
      activity_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      measure_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: true
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
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
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
