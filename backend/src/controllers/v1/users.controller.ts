import type { RequestHandler } from "express";
import protectRoute from "../../middlewares/auth/protectRoute.middleware.js";
import { db } from "../../prisma/db.js";
import type { GetMyProfileHanlder } from "../../types/handlers.js";

const _getMyProfile: GetMyProfileHanlder = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await db.orm.users.where({ id }).first();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userResponseObject = {
      id: user.id,
      userType: user.userType,
      username: user.username,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json({ success: true, user: userResponseObject });
  } catch (err) {
    next(err);
  }
};

const getMyProfile = [protectRoute, _getMyProfile] as RequestHandler[];

const usersController = { getMyProfile };

export default usersController;
