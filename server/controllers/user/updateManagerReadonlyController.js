const db = require("../../data/index.js");
const User = db.User;
const ApiError = require("../../utils/apiError.js");

const addManagerToReadonly = async (req, res, next) => {
    const managerId = req.params.id;

    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
        return next(new ApiError(403, "You are not authorized to access this resource!"));
    }

    try {
        const manager = await User.findByPk(managerId);
        if (!manager) 
            throw new ApiError(404, "Manager not found.");

        manager.readonly = true;
        await manager.save();

        res.status(200).json({
            success: true,
            message: "Manager added to readonly successfully",
            data: manager
        });
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, "Internal Server Error", error));
        }
    }
};

const removeManagerFromReadonly = async (req, res, next) => {
    const managerId = req.params.id;

    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
        return next(new ApiError(403, "You are not authorized to access this resource!"));
    }

    try {
        const manager = await User.findByPk(managerId);
        if (!manager) 
            throw new ApiError(404, "Manager not found.");

        manager.readonly = false;
        await manager.save();

        res.status(200).json({
            success: true,
            message: "Manager removed from readonly successfully",
            data: manager
        });
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, "Internal Server Error", error));
        }
    }
};

module.exports = {
    addManagerToReadonly,
    removeManagerFromReadonly
};
