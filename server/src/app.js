import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import routes from "./routes/index.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1", routes);

export default app;
