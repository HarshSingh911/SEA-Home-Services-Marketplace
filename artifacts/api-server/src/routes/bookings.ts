import { Router, type IRouter } from "express";
import {
  CreateBookingBody,
  CreateBookingResponse,
  GetBookingParams,
  GetBookingResponse,
  ListBookingsQueryParams,
  ListBookingsResponse,
} from "@workspace/api-zod";
import {
  createSupabaseBooking,
  getSupabaseBookingRows,
  getSupabaseService,
  toBookingView,
} from "../lib/sea-data";

const router: IRouter = Router();

router.get("/bookings", async (req, res): Promise<void> => {
  const parsed = ListBookingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const rows = await getSupabaseBookingRows({ status: parsed.data.status });
  const bookings = await Promise.all(rows.map(toBookingView));
  res.json(ListBookingsResponse.parse(bookings.filter(Boolean)));
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const service = await getSupabaseService(parsed.data.serviceId);
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  const id = `booking-${Date.now()}`;
  const booking = await createSupabaseBooking({
    id,
    user_id: "user-demo",
    service_id: parsed.data.serviceId,
    professional_id: parsed.data.professionalId ?? "pro-amit-sharma",
    status: "upcoming",
    scheduled_at: parsed.data.scheduledAt,
    address: parsed.data.address,
    total: Number(service.starting_price ?? service.startingPrice ?? service.price ?? 0) + 50,
    eta: "Professional assignment pending",
    progress: 0,
    instructions: parsed.data.instructions ?? null,
    payment_method: parsed.data.paymentMethod,
  });
  if (!booking) {
    res.status(500).json({ error: "Booking could not be created" });
    return;
  }
  res.status(201).json(CreateBookingResponse.parse(booking));
});

router.get("/bookings/:bookingId", async (req, res): Promise<void> => {
  const params = GetBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await getSupabaseBookingRows({ id: params.data.bookingId });
  const booking = row ? await toBookingView(row) : undefined;
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json(GetBookingResponse.parse(booking));
});

export default router;