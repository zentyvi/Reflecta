export {}; // Crucial: Makes this file a module so global augmentation works properly

export type RequestUser = {
  id: string;
  username: string;
  type: "USERNAME" | "GOOGLE";
};

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser | null;
    }
  }
}
