import dotenv from "dotenv";

dotenv.config({ path: ".env" });

import { db } from "./index";
import { sql } from "drizzle-orm";

async function migrate() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "games" (
      "app_id" text PRIMARY KEY NOT NULL,
      "title" text NOT NULL,
      "icon" text NOT NULL,
      "screenshots" json DEFAULT '[]'::json NOT NULL,
      "score" numeric NOT NULL,
      "genre" text NOT NULL,
      "price" integer DEFAULT 0 NOT NULL,
      "free" boolean DEFAULT true NOT NULL,
      "currency" text DEFAULT 'USD' NOT NULL,
      "video" text,
      "video_image" text,
      "description" text NOT NULL,
      "description_html" text,
      "developer" text NOT NULL,
      "installs" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("Migration applied successfully");
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
