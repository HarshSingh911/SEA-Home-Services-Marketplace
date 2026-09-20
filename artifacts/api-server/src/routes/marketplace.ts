import { Router, type IRouter } from "express";
import { and, eq, ilike, or } from "drizzle-orm";
import { db, categoriesTable, professionalsTable, servicesTable } from "@workspace/db";
import {
  GetHomeResponse,
  GetServiceParams,
  GetServiceResponse,
  ListCategoriesResponse,
  ListProfessionalsQueryParams,
  ListProfessionalsResponse,
  ListServicesQueryParams,
  ListServicesResponse,
} from "@workspace/api-zod";
import {
  ensureSeeded,
  getBookingView,
  getServices,
  seedServices,
  toProfessional,
  toService,
} from "../lib/sea-data";

const router: IRouter = Router();

router.get("/home", async (_req, res): Promise<void> => {
  await ensureSeeded();
  const [categories, services, professionals, recentlyBooked] = await Promise.all([
    db.select().from(categoriesTable),
    getServices(),
    db.select().from(professionalsTable),
    getBookingView("booking-ac-001"),
  ]);
  const categoryResponse = ListCategoriesResponse.parse(categories);
  const professionalResponse = ListProfessionalsResponse.parse(professionals.map(toProfessional));
  const bookings = recentlyBooked ? [recentlyBooked] : [];
  const data = {
    greeting: "Good morning, Aarav",
    location: "Indiranagar, Bengaluru",
    categories: categoryResponse,
    popularServices: services.slice(0, 4),
    recommended: services.slice(2, 6),
    recentlyBooked: bookings,
    offers: [
      { id: "offer-first-booking", title: "₹150 off your first booking", subtitle: "A little welcome from SEA", code: "SEA150", accent: "purple" },
      { id: "offer-weekend-care", title: "Weekend home care", subtitle: "Save 10% on selected services", code: "WEEKEND10", accent: "blue" },
    ],
    verifiedProfessionals: professionalResponse,
  };
  res.json(GetHomeResponse.parse(data));
});

router.get("/categories", async (_req, res): Promise<void> => {
  await ensureSeeded();
  const categories = await db.select().from(categoriesTable);
  res.json(ListCategoriesResponse.parse(categories));
});

router.get("/services", async (req, res): Promise<void> => {
  await ensureSeeded();
  const parsed = ListServicesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.json(ListServicesResponse.parse(await getServices(parsed.data)));
});

router.get("/services/:serviceId", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = GetServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select().from(servicesTable).where(eq(servicesTable.id, params.data.serviceId));
  if (!row) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  const reviews = [
    { id: "review-1", customerName: "Priya S.", rating: 5, comment: "Very professional and clear about the work. The AC is running perfectly.", date: "2 days ago" },
    { id: "review-2", customerName: "Vikram R.", rating: 5, comment: "Arrived on time and finished faster than expected.", date: "1 week ago" },
  ];
  const detail = {
    ...toService(row),
    included: row.included,
    excluded: row.excluded,
    addOns: [
      { id: "addon-gas-check", name: "Gas pressure top-up check", price: 99 },
      { id: "addon-installation", name: "Installation consultation", price: 149 },
    ],
    warranty: row.warranty,
    faqs: [
      { question: "Do I need to provide anything?", answer: "No. Your SEA professional brings the standard tools needed for the visit." },
      { question: "What if the professional finds a bigger issue?", answer: "You will get a clear quote before any additional work begins." },
    ],
    reviews,
  };
  res.json(GetServiceResponse.parse(detail));
});

router.get("/professionals", async (req, res): Promise<void> => {
  await ensureSeeded();
  const parsed = ListProfessionalsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { serviceId, area } = parsed.data;
  const professionals = await db.select().from(professionalsTable).where(
    area ? ilike(professionalsTable.area, `%${area}%`) : undefined,
  );
  res.json(ListProfessionalsResponse.parse(professionals.map(toProfessional)));
});

export default router;