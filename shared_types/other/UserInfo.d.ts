import type { Models } from "../../backend/src/prisma/contract.d.ts";

export {};

export type UserProfile = Pick<
  Models.unbound_User,
  "id" | "userType" | "username" | "displayName" | "createdAt" | "updatedAt"
>;
