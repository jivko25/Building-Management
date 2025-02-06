//server\data\models\User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_users",
          key: "id"
        }
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_users",
          key: "id"
        }
      },
      readonly: {  
        type: DataTypes.BOOLEAN,
        allowNull: true, 
        defaultValue: false 
      },
      terms: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    },
    {
      tableName: "tbl_users",
      timestamps: false
    }
  );

  User.associate = models => {
    User.belongsTo(models.User, {
      foreignKey: "manager_id",
      as: "manager"
    });

    User.hasMany(models.User, {
      foreignKey: "manager_id",
      as: "subordinates"
    });

    User.belongsTo(models.User, {
      foreignKey: "creator_id",
      as: "creator"
    });

    User.hasMany(models.User, {
      foreignKey: "creator_id",
      as: "createdUsers"
    });

    User.hasMany(models.Project, {
      foreignKey: "creator_id",
      as: "createdProjects"
    });
  };

  return User;
};
