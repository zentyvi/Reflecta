import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import type { AuthResponseBody } from "@shared/api/responses/auth.d.ts";
import type { FormErrorsObject } from "@shared/other/FormValidationErrors.d.ts";
import validateSignUp from "../../middlewares/validators/validateSignUp.middleware.ts";
import { db } from "../../prisma/db.ts";
import type {
  GithubLoginHandler,
  GoogleLoginHanlder,
  LoginHandler,
  SignUpHandler,
} from "../../types/endpoints";
import {
  createJWT,
  generateDefaultUsername,
  getFromEnv,
} from "../../utils/helpers.js";
import {
  makeBusinessErrorResponse,
  makeSuccessResponse,
} from "../../utils/makeResponse.ts";

const _signUp: SignUpHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const responseData = makeBusinessErrorResponse<FormErrorsObject>({
        errorData: errors.mapped(),
      });
      return res.status(400).json(responseData);
    }
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.orm.users
      .select("id", "username", "userType", "passwordVersion")
      .create({
        username: username.toLowerCase(),
        password: hashedPassword,
        userType: "USERNAME",
        passwordVersion: 1,
      });

    const token = createJWT(user);

    const responseData = makeSuccessResponse<AuthResponseBody>({ token });
    res.status(201).json(responseData);
  } catch (err) {
    next(err);
  }
};

const signUp = [validateSignUp, _signUp];

const login: LoginHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await db.orm.users
      .where({ username: username.toLowerCase() })
      .first();

    if (!user) {
      const errorData = { username: { msg: "User doesn't exist" } };
      const responseData = makeBusinessErrorResponse<FormErrorsObject>({
        errorData,
      });
      return res.status(400).json(responseData);
    }

    if (user.userType !== "USERNAME") {
      const errorData = {
        password: {
          msg: "You've used another method to login (Google or Github)",
        },
      };
      const responseData = makeBusinessErrorResponse<FormErrorsObject>({
        errorData,
      });
      return res.status(400).json(responseData);
    }

    const passwrodMatch = await bcrypt.compare(password, user?.password ?? "");
    if (!passwrodMatch) {
      const errorData = { password: { msg: "Incorrect password" } };
      const responseData = makeBusinessErrorResponse<FormErrorsObject>({
        errorData,
      });
      return res.status(400).json(responseData);
    }

    const payload = {
      id: user.id,
      username: user.username,
      userType: user.userType,
      passwordVersion: user.passwordVersion,
    };
    const token = createJWT(payload);

    const responseData = makeSuccessResponse<AuthResponseBody>({ token });
    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

const googleLogin: GoogleLoginHanlder = async (req, res, next) => {
  try {
    const { googleToken } = req.body;
    if (!googleToken) {
      const responseData = makeBusinessErrorResponse<string>({
        errorData: "Authorization google id is required",
      });
      return res.status(400).json(responseData);
    }

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
      },
    );

    if (!userResponse.ok) {
      const responseData = makeBusinessErrorResponse<string>({
        errorData: "Failed to fetch user from Google",
      });
      return res.status(401).json(responseData);
    }

    const googleUser = await userResponse.json();

    const googleId = googleUser.sub;
    const username = generateDefaultUsername();

    const user = await db.orm.users
      .select("id", "username", "userType", "passwordVersion")
      .where({ googleId })
      .upsert({
        update: {},
        create: { username, userType: "GOOGLE", googleId },
      });

    const token = createJWT(user);

    const responseData = makeSuccessResponse<AuthResponseBody>({ token });
    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

const githubLogin: GithubLoginHandler = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      const responseData = makeBusinessErrorResponse<string>({
        errorData: "Authorization code is required",
      });
      return res.status(400).json(responseData);
    }

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: getFromEnv("GITHUB_CLIENT_ID"),
          client_secret: getFromEnv("GITHUB_CLIENT_SECRET"),
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    const accessToken = tokenData.access_token;

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Node-App",
      },
    });

    const githubUser = await userResponse.json();
    const githubId = String(githubUser.id);
    const username =
      typeof githubUser?.login === "string"
        ? githubUser?.login.toLowerCase()
        : generateDefaultUsername();

    const user = await db.orm.users
      .select("id", "username", "userType", "passwordVersion")
      .where({ githubId: githubId })
      .upsert({
        update: {},
        create: { githubId, username, userType: "GITHUB" },
      });

    const token = createJWT(user);

    const responseData = makeSuccessResponse<AuthResponseBody>({ token });
    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

const authController = {
  signUp,
  login,
  googleLogin,
  githubLogin,
};

export default authController;
