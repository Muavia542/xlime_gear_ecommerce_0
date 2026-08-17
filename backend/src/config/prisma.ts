import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "./env.js";

const url = new URL(env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ""),
  connectionLimit: env.NODE_ENV === "production" ? 15 : 8,
  allowPublicKeyRetrieval: true,
  connectTimeout: 10_000,
  acquireTimeout: 10_000,
});

export const prisma = new PrismaClient({ adapter });
