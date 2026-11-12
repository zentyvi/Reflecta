export {};
import type { Models } from "../../backend/src/prisma/contract.d.ts";
import type { UserProfile } from "../other/UserInfo.d.ts";

type MyProfileErrorsBody = {
  success: false;
  message: string;
};

type MyProfileSuccessBody = {
  success: true;
  user: UserProfile;
};

export type MyProfileResponseBody = MyProfileErrorsBody | MyProfileSuccessBody;
