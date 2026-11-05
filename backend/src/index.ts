// @ts-ignore
import cors from "cors";
import "dotenv/config";
import express, { json, urlencoded } from "express";
import authorizeUser from "./middlewares/auth/authorizeUser.ts";
import api from "./routes/index.ts";
import { getFromEnv } from "./utils/helpers.ts";

const app = express();
const port = Number(getFromEnv("PORT"));

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(authorizeUser);
app.use("/api", api);

app.listen(port, () => console.log(`Server is running on port ${port}`));
