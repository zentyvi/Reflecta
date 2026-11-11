export {};
import type { Models } from "../../backend/src/prisma/contract.d.ts";

type MyProfileErrorsBody = {
  success: false;
  message: string;
};

type MyProfileSuccessBody = {
  success: true;
  user: Pick<
    Models.unbound_User,
    "id" | "userType" | "username" | "displayName" | "createdAt" | "updatedAt"
  >;
};

export type MyProfileResponseBody = MyProfileErrorsBody | MyProfileSuccessBody;
