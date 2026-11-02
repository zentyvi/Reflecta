import { sign } from "jsonwebtoken";
import type { JwtUserPayload } from "../@types/jwt";

const adjectives = [
  "cute",
  "cozy",
  "sleepy",
  "fluffy",
  "gentle",
  "happy",
  "mellow",
  "sweet",
  "tiny",
  "velvet",
  "dreamy",
  "soft",
  "kind",
  "calm",
  "sunny",
  "fuzzy",
  "silent",
  "bright",
  "curious",
  "noble",
  "clever",
  "brave",
  "chilly",
  "lucky",
  "peaceful",
  "bouncy",
  "magic",
  "warm",
  "smooth",
  "tidy",
  "playful",
  "massive",
];

const nouns = [
  "nectarine",
  "panda",
  "otter",
  "sprout",
  "cloud",
  "koala",
  "pebble",
  "cookie",
  "fox",
  "kitten",
  "marshmallow",
  "bunny",
  "chestnut",
  "muffin",
  "tea",
  "biscuit",
  "clover",
  "hazelnut",
  "acorn",
  "penguin",
  "tulip",
  "donut",
  "peach",
  "waffle",
  "hedgehog",
  "sparrow",
  "feather",
  "boba",
  "capybara",
  "star",
  "moon",
  "planet",
];

export function generateDefaultUsername() {
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `${randomAdj}-${randomNoun}${randomNumber}`;
}

export function getFromEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Not found. Please provide "${key}" in your .env file.`);
  } else {
    return value;
  }
}

export const createJWT = <
  T extends {
    id: string;
    username: string;
    userType: "USERNAME" | "GOOGLE" | "GITHUB";
    passwordVersion?: number | null;
  },
>(
  data: T,
  duration: string = "7d",
) => {
  // @ts-ignore
  const jwtToken = sign(
    {
      id: data.id,
      username: data.username,
    },
    getFromEnv("SECRET"),
    { expiresIn: duration },
  );

  return jwtToken;
};
