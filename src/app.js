import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import "./config/passport.js"
import passport from "passport";

connectDB();
const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(passport.initialize());

app.get("/",(req,res) =>{
    res.send("API funcionando");
});

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});

