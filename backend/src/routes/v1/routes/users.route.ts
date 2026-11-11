import { Router } from "express";
import usersController from "../../../controllers/v1/users.controller.ts";

const usersRoute = Router();

usersRoute.get("/me/profile", usersController.getMyProfile);

export default usersRoute;
