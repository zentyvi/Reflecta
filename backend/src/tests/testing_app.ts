import "dotenv/config";
import express, { json, urlencoded } from "express";
import authorizeUser from "../middlewares/auth/authorizeUser.ts";
import api from "../routes/index.ts";
import { getFromEnv } from "../utils/helpers.ts";

const app = express();
const port = Number(getFromEnv("PORT"));

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(authorizeUser);
app.use("/api", api);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));

export default app;
