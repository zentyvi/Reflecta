import { Router } from "express";
import v1Route from "./v1/index.ts";

const api = Router();

api.use("/v1", v1Route);

export default api;
