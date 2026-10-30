// @ts-ignore
import cors from "cors";
import express, { json, urlencoded } from "express";
import "dotenv/config";
import { getFromEnv } from "./utils/helpers.ts";

const app = express();
const port = Number(getFromEnv("PORT"));

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.listen(port, () => console.log(`Server is running on port ${port}`));
