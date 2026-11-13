export {};

// --- JWT types ---

// User payload types
type JwtPayloadBase = {
  id: string;
  username: string;
};

type JwtPayloadUsername = JwtPayloadBase & {
  userType: "USERNAME";
  passwordVersion: number;
};

type JwtPayloadOther = JwtPayloadBase & {
  userType: "GOOGLE" | "GITHUB";
  passwordVersion?: number;
};

export type JwtUserPayload = JwtPayloadUsername | JwtPayloadOther;
