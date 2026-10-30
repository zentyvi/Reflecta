import mongo from "@prisma/orm-mongo/runtime";
import { contractFromJson } from "@prisma/orm-mongo/static";

import service from "../../service.ts";
import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };

export const contract = contractFromJson<Contract>(contractJson);

function getDatabaseUrl(): string | undefined {
  try {
    return service.input().databaseUrl.expose();
  } catch {
    return process.env.DATABASE_URL;
  }
}

const databaseUrl = getDatabaseUrl();

export const db = databaseUrl ? mongo({ contract, url: databaseUrl }) : mongo({ contract });
