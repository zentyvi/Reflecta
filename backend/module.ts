import { module } from "@prisma/composer";
import { envSecret } from "@prisma/composer-prisma-cloud";
import app from "./service.ts";

export default module("backend", ({ provision }) => {
  provision(app, {
    input: { databaseUrl: envSecret("MONGODB_URL") },
  });
});
