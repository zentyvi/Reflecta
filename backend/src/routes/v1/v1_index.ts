import { Router } from "express";
import authRoute from "./routes/auth.route.ts";
import usersRoute from "./routes/users.route.ts";

const v1Route = Router();

v1Route.use("/auth", authRoute);
v1Route.use("/users", usersRoute);

export default v1Route;
