//server\data\models\Accountant.js
module.exports = (sequelize, DataTypes) => {
    const Accountant = sequelize.define(
      "Accountant",
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
        note: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        number: {
          type: DataTypes.STRING,
          allowNull: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true
        },
        company_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "tbl_companies",
            key: "id"
          }
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "tbl_users",
            key: "id"
          }
        },
        status: {
          type: DataTypes.ENUM("active", "inactive"),
          defaultValue: "inactive"
        },
        measure_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "tbl_measures",
            key: "id"
          }
        }
      },
      {
        tableName: "tbl_accountants",
        timestamps: false
      }
    );
  
    Accountant.associate = models => {
      Accountant.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company"
      });
  
      Accountant.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });
  
      Accountant.belongsToMany(models.Task, {
        through: "tbl_task_accountants",
        foreignKey: "accountant_id",
        otherKey: "task_id",
        as: "tasks"
      });
  
      Accountant.belongsTo(models.Measure, {
        foreignKey: "measure_id",
        as: "measure"
      });

      Accountant.belongsToMany(models.Invoice, {
        through: "tbl_accountant_invoices",
        foreignKey: "accountant_id", 
        otherKey: "invoice_id",
        as: "invoices"
      });
    };
  
    return Accountant;
  };