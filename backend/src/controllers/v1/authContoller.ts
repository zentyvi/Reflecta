import bcrypt from "bcryptjs";
import type { Handler } from "express";
import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import validateSignUp from "../../middlewares/validators/validateSignUp.ts";
import { db } from "../../prisma/db.ts";
import {
  createJWT,
  generateDefaultUsername,
  getFromEnv,
} from "../../utils/helpers.js";

const GOOGLE_CLIENT_ID = getFromEnv("GOOGLE_CLIENT_ID");
const google_client = new OAuth2Client(GOOGLE_CLIENT_ID);

const _signUp: Handler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
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

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

const signUp = [validateSignUp, _signUp];

const login: Handler = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await db.orm.users
      .where({ username: username.toLowerCase() })
      .first();

    if (!user) {
      return res
        .status(404)
        .json({ errors: { username: { msg: "User doesn't exist" } } });
    }

    if (user.userType !== "USERNAME" ) {
      return res.status(400).json({
        errors: {
          password: {
            msg: "You've used another method to login (Google or Github)",
          },
        },
      });
    }

    const passwrodMatch = await bcrypt.compare(password, user?.password ?? "");
    if (!passwrodMatch) {
      return res
        .status(400)
        .json({ errors: { password: { msg: "Incorrect password" } } });
    }

    const payload = {
      id: user.id,
      username: user.username,
      userType: user.userType,
      passwordVersion: user.passwordVersion,
    };
    const token = createJWT(payload);

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

const googleLogin: Handler = async (req, res, next) => {
  try {
    const { token: googleToken } = req.body;
    if (!googleToken) {
      return res
        .status(400)
        .json({ message: "Authorization google id is required" });
    }

    const ticket = await google_client.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const username = generateDefaultUsername();

    const user = await db.orm.users
      .select("id", "username", "userType", "passwordVersion")
      .where({ googleId: payload?.sub })
      .upsert({
        update: {},
        create: { username, userType: "GOOGLE", googleId: payload?.sub },
      });

    const token = createJWT(user);

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

const githubLogin: Handler = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
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

    res.status(200).json({ token });
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
