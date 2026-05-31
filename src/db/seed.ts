import dotenv from "dotenv";

dotenv.config({ path: ".env" });

import { db } from "./index";
import { games } from "./schema";
import casualGames from "../lib/casual_games.json";

async function seed() {
  const values = casualGames.map((g) => ({
    appId: g.appId,
    title: g.title,
    icon: g.icon,
    screenshots: g.screenshots ?? [],
    score: String(g.score),
    genre: g.genre,
    price: g.price ?? 0,
    free: g.free ?? true,
    currency: g.currency ?? "USD",
    video: g.video ?? null,
    videoImage: g.videoImage ?? null,
    description: g.description,
    descriptionHTML: g.descriptionHTML ?? null,
    developer: g.developer,
    installs: g.installs,
  }));

  await db.insert(games).values(values).onConflictDoNothing();
  console.log(`Seeded ${values.length} games`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
