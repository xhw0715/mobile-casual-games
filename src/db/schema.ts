import { pgTable, text, integer, boolean, numeric, json, timestamp } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  appId: text("app_id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon").notNull(),
  screenshots: json("screenshots").$type<string[]>().default([]).notNull(),
  score: numeric("score").notNull(),
  genre: text("genre").notNull(),
  price: integer("price").default(0).notNull(),
  free: boolean("free").default(true).notNull(),
  currency: text("currency").default("USD").notNull(),
  video: text("video"),
  videoImage: text("video_image"),
  ishome: boolean("ishome").default(false).notNull(),
  description: text("description").notNull(),
  descriptionHTML: text("description_html"),
  developer: text("developer").notNull(),
  installs: text("installs").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
