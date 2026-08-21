import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

connectDB();
const app = express();

app.use(express.json());

app.use(cookieParser());

app.get("/",(req,res) =>{
    res.send("API funcionando");
});

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});

