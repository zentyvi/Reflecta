import { Router } from "express";
import authController from "../../../controllers/v1/auth.contoller.ts";

const authRoute = Router();

authRoute.post("/sign-up", ...authController.signUp);
authRoute.post("/login", authController.login);
authRoute.post("/google", authController.googleLogin);
authRoute.post("/github", authController.githubLogin);

export default authRoute;
