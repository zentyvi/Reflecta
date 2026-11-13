import type { MyProfileResponseBody } from "@shared/api/responses/users.js";
import type { RequestHandler } from "express";
import protectRoute from "../../middlewares/auth/protectRoute.middleware.js";
import { db } from "../../prisma/db.js";
import type { GetMyProfileHanlder } from "../../types/endpoints.js";
import {
  makeSuccessResponse,
  makeSystemErrorResponse,
} from "../../utils/makeResponse.js";

const _getMyProfile: GetMyProfileHanlder = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await db.orm.users.where({ id }).first();

    if (!user) {
      const responseData = makeSystemErrorResponse({
        statusCode: 404,
        message: "User not found",
      });
      return next(responseData);
    }

    const userResponseObject = {
      id: user.id,
      userType: user.userType,
      username: user.username,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const responseData =
      makeSuccessResponse<MyProfileResponseBody>(userResponseObject);
    return res.json(responseData);
  } catch (err) {
    next(err);
  }
};

const getMyProfile = [protectRoute, _getMyProfile] as RequestHandler[];

const usersController = { getMyProfile };

export default usersController;
