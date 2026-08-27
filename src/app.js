import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import "./config/passport.js"
import passport from "passport";
import { errorHandler } from "./middlewares/errorHandler.js";
import sessionRouter from "./routes/session.router.js"
import eventRouter from "./routes/event.router.js";
import ticketRouter from "./routes/ticket.router.js";

connectDB();
const app = express();

app.use(express.json());

app.use(cookieParser());


app.use(passport.initialize());


app.get("/",(req,res) =>{
    res.send("API funcionando");
});

const PORT = process.env.PORT

app.use("/api/sessions",sessionRouter)
app.use("/api/events",eventRouter)
app.use("/api/tickets",ticketRouter)

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});

