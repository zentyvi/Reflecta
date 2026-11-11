import "dotenv/config";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { db } from "./db.ts";

const usersNumber = 2;
const memoriesNumber = 3;
const eventsNumber = 3;

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

    const userIds: string[] = [];
    const memoryIds: string[] = [];
    const eventIds: string[] = [];

    if (usersNumber > 0) {
      console.log("Creating new users...");
      console.log("Hashing passwords...");
      const hashedPassword = await bcrypt.hash("password123", 10);

      for (let i = 0; i < usersNumber; i++) {
        const user = await db.orm.users.select("id").create({
          username: faker.internet.username(),
          userType: "USERNAME",
          displayName: faker.internet.displayName(),
          password: hashedPassword,
          updatedAt: new Date(),
          passwordVersion: 1,
        });

        userIds.push(user.id);
      }
    }

    if (memoriesNumber > 0) {
      console.log("Creating memories...");
      if (userIds.length === 0) {
        throw new Error(
          "[Failed to create memories - no users were found] To create memories, you must create users first.",
        );
      }
      for (let userId of userIds) {
        for (let i = 0; i < memoriesNumber; i++) {
          const rating = Math.floor((Math.random() * 1000) % 10);
          const memory = await db.orm.memories.select("id").create({
            title: faker.book.title(),
            rating,
            authorId: userId,
            date: new Date(),
          });
          memoryIds.push(memory.id);
        }
      }
    }

    if (eventsNumber > 0) {
      console.log("Creating events...");
      if (memoryIds.length === 0) {
        throw new Error(
          "[Failed to create events - no events were found] To create events, you must create memories first.",
        );
      }
      for (let memoryId of memoryIds) {
        for (let i = 0; i < eventsNumber; i++) {
          const event = await db.orm.events
            .select("id")
            .create({ title: faker.book.title(), memoryId });
        }
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
