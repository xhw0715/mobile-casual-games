import { db } from "@/db";
import { games } from "@/db/schema";
import { NextRequest } from "next/server";
import { ok, notFound, internalError } from "@/lib/api-response";
import { slugify } from "@/lib/slugify";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const allGames = await db.select().from(games);
    const game = allGames.find((g) => slugify(g.title) === id);

    if (!game) {
      return notFound(`Game "${id}" not found`);
    }

    return ok({ ...game, slug: id });
  } catch (err) {
    console.error(`GET /api/games/[id] failed:`, err);
    return internalError("Failed to fetch game");
  }
}
