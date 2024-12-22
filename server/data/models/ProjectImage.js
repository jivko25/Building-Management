// server\data\models\ProjectImage.js
module.exports = (sequelize, DataTypes) => {
    const ProjectImage = sequelize.define(
      "ProjectImage",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        projectId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "tbl_projects",
            key: "id"
          }
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        tableName: "tbl_project_images",
        timestamps: false
      }
    );
  
    ProjectImage.associate = models => {
      ProjectImage.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project"
      });
    };
  
    return ProjectImage;
  };