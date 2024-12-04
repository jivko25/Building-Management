module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tbl_projects',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        artisan_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tbl_artisans',
                key: 'id'
            }
        },
        activity_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tbl_activities',
                key: 'id'
            }
        },
        measure_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tbl_measures',
                key: 'id'
            }
        },
        price_per_measure: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        total_work_in_selected_measure: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
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
            defaultValue: 'active'
        }
    }, {
        tableName: 'tbl_tasks',
        timestamps: false
    });

    Task.associate = (models) => {
        Task.belongsTo(models.Project, {
            foreignKey: 'project_id',
            as: 'project'
        });
    
        Task.belongsTo(models.Artisan, {
            foreignKey: 'artisan_id',
            as: 'artisan'
        });
    
        Task.belongsTo(models.Activity, {
            foreignKey: 'activity_id',
            as: 'activity'
        });
    
        Task.belongsTo(models.Measure, {
            foreignKey: 'measure_id',
            as: 'measure'
        });
    
        Task.hasMany(models.WorkItem, {
            foreignKey: 'task_id',
            as: 'workItems'
        });
    };

    return Task;
};