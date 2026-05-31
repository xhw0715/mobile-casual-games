import { eq, desc } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { games } from "@/db/schema";
import { ok, internalError } from "@/lib/api-response";
import { slugify } from "@/lib/slugify";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ishome = searchParams.get("ishome") === "true";

    const data = await db
      .select()
      .from(games)
      .where(ishome ? eq(games.ishome, true) : undefined)
      .orderBy(desc(games.score))
      .limit(4);

    return ok(data.map((g) => ({ ...g, slug: slugify(g.title) })));
  } catch (err) {
    console.error("GET /api/games/featured failed:", err);
    return internalError("Failed to fetch featured games");
  }
}
