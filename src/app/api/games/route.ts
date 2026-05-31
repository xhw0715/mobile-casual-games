import { and, desc, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { games } from "@/db/schema";
import { ok, paginated, badRequest, internalError } from "@/lib/api-response";
import { slugify } from "@/lib/slugify";
import type { PaginationMeta } from "@/lib/api/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));
    const genre = searchParams.get("genre");

    if (Number.isNaN(Number(searchParams.get("page"))) && searchParams.has("page")) {
      return badRequest("Invalid page parameter");
    }

    const offset = (page - 1) * limit;
    const filters = genre && genre !== "All" ? eq(games.genre, genre) : undefined;
    const where = filters ? and(filters) : undefined;

    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(games)
        .where(where)
        .orderBy(desc(games.score))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(games)
        .where(where),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);
    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total,
    };

    return paginated(
      data.map((g) => ({ ...g, slug: slugify(g.title) })),
      pagination,
    );
  } catch (err) {
    console.error("GET /api/games failed:", err);
    return internalError("Failed to fetch games");
  }
}
