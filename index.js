import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import users from "./routes/user-routes.js";
import blogs from "./routes/blog-routes.js";
import dataBase from "./config/db.js";
const app = express();

// Database
dataBase()

app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.json());

app.use('/api/users', users)
app.use('/api/blogs', blogs)

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port} 🚀`));
