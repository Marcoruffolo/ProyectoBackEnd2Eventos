import { AppError } from "../utils/AppError.js";

export const authorize = (allowedRoles) => {
    return(req, res, next) => {
        if(!allowedRoles.includes(req.user.role)) {
            return next(new AppError("No tenés permisos para realizar esta acción",403))
        }
        next()
    }
}