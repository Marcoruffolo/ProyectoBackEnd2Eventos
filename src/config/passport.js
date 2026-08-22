import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JwtStrategy } from "passport-jwt"
import { registerUser,loginUser, getUserById } from "../services/user.service.js";

const cookieExtractor = (req) => {
    let token = null 
    if(req && req.cookies) {
        token = req.cookies.token
    }
    return token
}

passport.use("register", new LocalStrategy({
    usernameField: "email",
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const { first_name, last_name } = req.body
        const newUser = await registerUser({ first_name, last_name, email, password })
        return done(null,newUser)
    }
    catch(error){
        return done(error)
    }
}))

passport.use("login", new LocalStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    try{
        const user = await loginUser(email,password)
        return done(null,user)
    }
    catch(error){
        return done(error)
    }
}))

passport.use("current", new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
}, async (jwt_payload, done) => {
    try {
        const user = await getUserById(jwt_payload.id)
        if(!user){
            return done(null,false)
        }
        return done(null,user)
    }
    catch (error){
        return done(error)
    }
}))