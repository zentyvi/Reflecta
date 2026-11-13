// @ts-ignore
import cors from "cors";
import "dotenv/config";
import express, { json, urlencoded } from "express";
import authorizeUser from "./middlewares/auth/authorizeUser.middleware.ts";
import api from "./routes/api_index.ts";
import { getFromEnv } from "./utils/helpers.ts";
import globalErrorHanlder from "./middlewares/globalErrorHanlder.ts";

const app = express();
const port = Number(getFromEnv("PORT"));

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(authorizeUser);

// API routes
app.use("/api", api);

// Hanlde errors
app.use(globalErrorHanlder);

app.listen(port, () => console.log(`Server is running on port ${port}`));
