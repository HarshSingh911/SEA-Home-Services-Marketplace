import { integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("sea_bookings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  serviceId: text("service_id").notNull(),
  professionalId: text("professional_id"),
  status: text("status").notNull().default("upcoming"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  address: text("address").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  eta: text("eta").notNull().default("Pending assignment"),
  progress: integer("progress").notNull().default(0),
  instructions: text("instructions"),
  paymentMethod: text("payment_method").notNull().default("upi"),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;