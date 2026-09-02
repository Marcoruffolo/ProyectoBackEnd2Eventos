import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT

connectDB();

app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
