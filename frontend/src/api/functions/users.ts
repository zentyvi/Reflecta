import type { MyProfileResponseBody } from "@shared/api/users.d.ts";
import httpClient from "../inner/httpClient.ts";

async function getMyProfile() {
  try {
    const result = await httpClient.get<string, MyProfileResponseBody>(
      "/users/me/profile",
      { authenticationRequired: true },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error(`[Failed to get my profile] ${message}`);
  }
}

const users = {
  getMyProfile,
};

export default users;
