import { Router, type IRouter } from "express";
import { count, eq, sum } from "drizzle-orm";
import { db, bookingsTable, professionalsTable, usersTable } from "@workspace/db";
import { GetAdminSummaryResponse, GetProfessionalDashboardResponse } from "@workspace/api-zod";
import { ensureSeeded, seedProfessionals, toProfessional } from "../lib/sea-data";

const router: IRouter = Router();

router.get("/professional/dashboard", async (_req, res): Promise<void> => {
  await ensureSeeded();
  const professional = toProfessional(seedProfessionals[0]);
  const [earnings] = await db.select({ total: sum(bookingsTable.total) }).from(bookingsTable).where(eq(bookingsTable.professionalId, professional.id));
  const [jobCount] = await db.select({ total: count() }).from(bookingsTable).where(eq(bookingsTable.professionalId, professional.id));
  res.json(GetProfessionalDashboardResponse.parse({
    professional,
    todayEarnings: Number(earnings?.total ?? 0),
    todayJobs: Number(jobCount?.total ?? 0),
    pendingRequests: 3,
    upcomingJobs: 5,
    isOnline: true,
  }));
});

router.get("/admin/summary", async (_req, res): Promise<void> => {
  await ensureSeeded();
  const [users, professionals, bookings, gmv] = await Promise.all([
    db.select({ total: count() }).from(usersTable),
    db.select({ total: count() }).from(professionalsTable),
    db.select({ total: count() }).from(bookingsTable),
    db.select({ total: sum(bookingsTable.total) }).from(bookingsTable),
  ]);
  const totalUsers = Number(users[0]?.total ?? 0);
  const totalProfessionals = Number(professionals[0]?.total ?? 0);
  const totalBookings = Number(bookings[0]?.total ?? 0);
  const gmvValue = Number(gmv[0]?.total ?? 0);
  res.json(GetAdminSummaryResponse.parse({
    totalUsers,
    activeUsers: totalUsers,
    totalProfessionals,
    activeProfessionals: totalProfessionals,
    totalBookings,
    completedBookings: 12,
    cancelledBookings: 1,
    gmv: gmvValue,
    revenue: gmvValue * 0.18,
    commission: gmvValue * 0.12,
    averageOrderValue: totalBookings ? gmvValue / totalBookings : 0,
  }));
});

export default router;