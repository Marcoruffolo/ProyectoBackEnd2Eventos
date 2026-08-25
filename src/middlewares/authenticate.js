import { AppError } from "../utils/AppError.js"
import passport from "passport"

export const authenticate = (req, res, next) => {
    passport.authenticate("current", { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return next(new AppError("No autenticado", 401))
        }
        req.user = user
        next()
    })(req, res, next)
}