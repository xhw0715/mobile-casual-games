import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _db = drizzle(neon(process.env.DATABASE_URL));
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const real = getDb();
    const value = (real as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(real);
    }
    return value;
  },
});
