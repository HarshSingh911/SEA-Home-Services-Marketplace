import { boolean, integer, numeric, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const professionalsTable = pgTable("sea_professionals", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url").notNull(),
  verified: boolean("verified").notNull().default(false),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull(),
  totalJobs: integer("total_jobs").notNull().default(0),
  experience: text("experience").notNull(),
  skills: text("skills").array().notNull().default([]),
  availability: text("availability").notNull(),
  startingPrice: numeric("starting_price", { precision: 10, scale: 2 }).notNull(),
  area: text("area").notNull(),
  isOnline: boolean("is_online").notNull().default(true),
});

export const insertProfessionalSchema = createInsertSchema(professionalsTable);
export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;
export type Professional = typeof professionalsTable.$inferSelect;