// server\data\models\Project.js
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
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
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_companies",
          key: "id"
        }
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "City location of the project"
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive"
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_users",
          key: "id"
        }
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_clients",
          key: "id"
        }
      }
    },
    {
      tableName: "tbl_projects",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  Project.associate = models => {
    Project.belongsTo(models.Company, {
      foreignKey: "company_id",
      as: "company"
    });

    Project.hasMany(models.Task, {
      foreignKey: "project_id",
      as: "tasks"
    });

    Project.belongsTo(models.User, {
      foreignKey: "creator_id",
      as: "creator"
    });

    Project.belongsTo(models.Client, {
      foreignKey: "client_id",
      as: "client"
    });

    Project.hasMany(models.DefaultPricing, {
      foreignKey: "project_id",
      as: "defaultPricing"
    });

    Project.hasMany(models.ProjectImage, {
      foreignKey: "projectId",
      as: "images"
    });
  };

  return Project;
};
