import { integer, numeric, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const servicesTable = pgTable("sea_services", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  startingPrice: numeric("starting_price", { precision: 10, scale: 2 }).notNull(),
  duration: text("duration").notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull(),
  bookings: integer("bookings").notNull().default(0),
  accent: text("accent").notNull(),
  included: text("included").array().notNull().default([]),
  excluded: text("excluded").array().notNull().default([]),
  warranty: text("warranty").notNull(),
});

export const insertServiceSchema = createInsertSchema(servicesTable);
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;