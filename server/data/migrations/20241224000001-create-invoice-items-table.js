"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Creating invoice items table...");
    await queryInterface.createTable("tbl_invoice_items", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_invoices",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      work_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_workitems",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_activities",
          key: "id"
        }
      },
      measure_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_measures",
          key: "id"
        }
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tbl_projects",
          key: "id"
        }
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_tasks",
          key: "id"
        }
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      price_per_unit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
    console.log("Invoice items table created successfully!");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_invoice_items");
  }
};
