import "dotenv/config";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import orm, { db } from "./db.ts";

const usersNumber = 5;

async function main() {
  console.log("Deleting old data...");
  db.query.from("events").deleteAll();
  db.query.from("memories").deleteAll();
  db.query.from("users").deleteAll();

  if (usersNumber > 0) {
    console.log("Creating new users...");
    console.log("Hashing passwords...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    for (let i = 0; i < usersNumber; i++) {
      await orm.users.create({
        username: faker.internet.username(),
        userType: "USERNAME",
        displayName: faker.internet.displayName(),
        password: hashedPassword,
        updatedAt: new Date(),
      });
    }
  }

  console.log("Closing connection...");
  await db.close();
  console.log("Database has been populated successfully!");
}

main();
