import "dotenv/config";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { db } from "./db.ts";

const usersNumber = 2;

async function seed() {
  try {
    console.log("Deleting old data...");
    const queries = [];
    queries.push(db.query.from("events").deleteAll());
    queries.push(db.query.from("memories").deleteAll());
    queries.push(db.query.from("users").deleteAll());
    const runtime = await db.runtime();

    for (let i of queries) {
      await runtime.query(i);
    }

    if (usersNumber > 0) {
      console.log("Creating new users...");
      console.log("Hashing passwords...");
      const hashedPassword = await bcrypt.hash("password123", 10);

      for (let i = 0; i < usersNumber; i++) {
        await db.orm.users.create({
          username: faker.internet.username(),
          userType: "USERNAME",
          displayName: faker.internet.displayName(),
          password: hashedPassword,
          updatedAt: new Date(),
        });
      }
    }

    console.log("Database has been populated successfully!");
  } catch (e) {
    console.error("[Failed to seed database]", e);
  } finally {
    console.log("Closing connection...");
    await db.close();
  }
}

seed();
