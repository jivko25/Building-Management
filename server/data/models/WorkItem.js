module.exports = (sequelize, DataTypes) => {
    const WorkItem = sequelize.define('WorkItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tbl_tasks',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        finished_work: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('done', 'in_progress'),
            defaultValue: 'in_progress'
        }
    }, {
        tableName: 'tbl_workitems',
        timestamps: false
    });

    WorkItem.associate = (models) => {
        WorkItem.belongsTo(models.Task, {
            foreignKey: 'task_id',
            as: 'task'
        });
    };

    return WorkItem;
};