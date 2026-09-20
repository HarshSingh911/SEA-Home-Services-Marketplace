import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable, professionalsTable, servicesTable } from "@workspace/db";
import {
  CreateBookingBody,
  CreateBookingResponse,
  GetBookingParams,
  GetBookingResponse,
  ListBookingsQueryParams,
  ListBookingsResponse,
} from "@workspace/api-zod";
import { ensureSeeded, getBookingView, toProfessional, toService } from "../lib/sea-data";

const router: IRouter = Router();

router.get("/bookings", async (req, res): Promise<void> => {
  await ensureSeeded();
  const parsed = ListBookingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const rows = await db.select().from(bookingsTable).where(
    parsed.data.status ? eq(bookingsTable.status, parsed.data.status) : undefined,
  );
  const bookings = await Promise.all(rows.map((row) => getBookingView(row.id)));
  res.json(ListBookingsResponse.parse(bookings.filter(Boolean)));
});

router.post("/bookings", async (req, res): Promise<void> => {
  await ensureSeeded();
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, parsed.data.serviceId));
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  const id = `booking-${Date.now()}`;
  const professionalId = parsed.data.professionalId ?? "pro-amit-sharma";
  await db.insert(bookingsTable).values({
    id,
    userId: "user-demo",
    serviceId: service.id,
    professionalId,
    status: "upcoming",
    scheduledAt: new Date(parsed.data.scheduledAt),
    address: parsed.data.address,
    total: String(Number(service.startingPrice) + 50),
    eta: "Professional assignment pending",
    progress: 0,
    instructions: parsed.data.instructions ?? null,
    paymentMethod: parsed.data.paymentMethod,
  });
  const booking = await getBookingView(id);
  if (!booking) {
    res.status(500).json({ error: "Booking could not be created" });
    return;
  }
  res.status(201).json(CreateBookingResponse.parse(booking));
});

router.get("/bookings/:bookingId", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = GetBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const booking = await getBookingView(params.data.bookingId);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json(GetBookingResponse.parse(booking));
});

export default router;