import { Router } from "express";
import v1Route from "./v1/v1_index.ts";

const api = Router();

api.use("/v1", v1Route);

export default api;
