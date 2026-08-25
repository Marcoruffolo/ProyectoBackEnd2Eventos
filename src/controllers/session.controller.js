import passport from "passport";
import { UserDTO } from "../dto/user.dto.js";
import { AppError }  from "../utils/AppError.js";
import { generateToken } from "../utils/jwt.js";

export const register = (req, res, next) => {
    passport.authenticate("register", { session : false } , (err, user, info) => {
        if(err){
            return next(err)
        }
        if(!user){
            return next(new AppError("No se pudo registrar el usuario", 400))
        }
        res.status(201).json({ status: "success", payload: UserDTO(user) })
    })(req, res, next)
}

export const login = (req, res, next) => {

    passport.authenticate("login", { session : false } , (err, user, info) => {
        if(err){
            return next(err)
        }
        if(!user){
            return next(new AppError("no se ha podido loguear", 401))
        }

        const payload = { id: user._id, role: user.role }
        const token = generateToken(payload)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({ status: "success", payload: UserDTO(user)})
    })(req, res, next)
}

export const current = (req, res, next) => {
    passport.authenticate("current", { session: false } , (err, user, info) => {
        if(err){
            return next(err)
        }
        if(!user){
            return next(new AppError("No autenticado",401))
        }
        res.status(200).json({ status: "success", payload: UserDTO(user)})
    })(req, res, next)
}

export const logout = (req, res, next) => {
    res.clearCookie("token")
    res.status(200).json({ status: "success", message: "Sesión cerrada"})
}