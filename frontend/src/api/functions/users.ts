import type { MyProfileResponseBody } from "@shared/api/responses/users.d.ts";
import httpClient from "../inner/httpClient.ts";

async function getMyProfile() {
  try {
    const result = await httpClient.get<MyProfileResponseBody>(
      "/users/me/profile",
      { authenticationRequired: true },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "No message";
    console.error(`[Failed to get my profile]: ${message}`);
    throw err;
  }
}

const users = {
  getMyProfile,
};

export default users;
