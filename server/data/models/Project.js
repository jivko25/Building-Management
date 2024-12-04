module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
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
                model: 'tbl_companies',
                key: 'id'
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
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
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'inactive'
        }
    }, {
        tableName: 'tbl_projects',
        timestamps: false
    });

    Project.associate = (models) => {
        Project.belongsTo(models.Company, {
            foreignKey: 'company_id',
            as: 'company'
        });

        Project.hasMany(models.Task, {
            foreignKey: 'project_id',
            as: 'tasks'
        });
    };

    return Project;
};