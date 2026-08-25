import passport from "passport";
import { UserDTO } from "../dto/user.dto.js";
import { AppError }  from "../utils/AppError.js";

export const register = (req, res, next) => {
    passport.authenticate("register", { session : false } , (err, user, info) => {
        if(err){
            return next(err)
        }
        if(!user){
            return next(new AppError("No se pudo registrar el usuario",400))
        }
        res.status(201).json({ status: "success", payload: UserDTO(user) })
    })(req, res, next)
}