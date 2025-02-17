const db = require("../../data/index.js");
const User = db.User;
const ApiError = require("../../utils/apiError");
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

const updateManagerReadonly = async (req, res, next) => {
    const managerId = req.params.id;

    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
        return next(new ApiError(403, "You are not authorized to access this resource!"));
    }

    try {
        const manager = await User.findByPk(managerId);
        if (!manager) {
            throw new ApiError(404, "Manager not found.");
        }

        await User.update(
            { readonly: manager.readonly ? false : true },
            { where: { creator_id: managerId } }
          );

        manager.readonly = manager.readonly ? false : true;
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

const updateManagerLimit = async (req, res, next) => {
    const managerId = req.params.id;
    const { user_limit } = req.body;

    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
        return next(new ApiError(403, "You are not authorized to access this resource!"));
    }

    try {
        const manager = await User.findByPk(managerId);
        if (!manager) {
            throw new ApiError(404, "Manager not found.");
        }

        manager.user_limit = user_limit;
        await manager.save();
        
        res.status(200).json({
            success: true,
            message: "Manager limit updated successfully",
            data: manager
        });
    } catch (error) {
        next(new ApiError(500, "Internal Server Error", error));
    }
};


module.exports = {
    addManagerToReadonly,
    removeManagerFromReadonly,
    updateManagerReadonly,
    updateManagerLimit
};
