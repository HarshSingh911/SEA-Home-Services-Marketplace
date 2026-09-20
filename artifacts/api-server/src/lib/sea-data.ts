import { and, eq, ilike, or } from "drizzle-orm";
import {
  db,
  bookingsTable,
  categoriesTable,
  professionalsTable,
  servicesTable,
  usersTable,
} from "@workspace/db";

const serviceImages = {
  ac: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
  plumbing: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
  electrical: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
  painting: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80",
} as const;

export const seedCategories = [
  { id: "cat-electrical", name: "Electrician", icon: "Zap", serviceCount: 12 },
  { id: "cat-plumbing", name: "Plumber", icon: "Wrench", serviceCount: 9 },
  { id: "cat-ac", name: "AC Repair", icon: "Snowflake", serviceCount: 8 },
  { id: "cat-cleaning", name: "Cleaning", icon: "Sparkles", serviceCount: 15 },
  { id: "cat-appliance", name: "Appliance Repair", icon: "Refrigerator", serviceCount: 11 },
  { id: "cat-salon", name: "Beauty & Salon", icon: "Scissors", serviceCount: 16 },
  { id: "cat-painting", name: "Painting", icon: "Paintbrush", serviceCount: 7 },
  { id: "cat-maintenance", name: "Home Maintenance", icon: "House", serviceCount: 13 },
];

export const seedServices = [
  {
    id: "svc-ac-service",
    categoryId: "cat-ac",
    name: "AC service & repair",
    description: "Keep your cooling running smoothly with a complete AC care visit.",
    imageUrl: serviceImages.ac,
    startingPrice: "399.00",
    duration: "30–60 min",
    rating: "4.8",
    bookings: 2480,
    accent: "blue",
    included: ["Filter cleaning", "Gas pressure check", "Cooling performance test", "Outdoor unit inspection"],
    excluded: ["Spare parts", "Gas refill, if required"],
    warranty: "30-day service warranty",
  },
  {
    id: "svc-bathroom-cleaning",
    categoryId: "cat-cleaning",
    name: "Bathroom deep clean",
    description: "A detail-first deep clean for a fresher, brighter bathroom.",
    imageUrl: serviceImages.cleaning,
    startingPrice: "299.00",
    duration: "45–75 min",
    rating: "4.9",
    bookings: 1842,
    accent: "purple",
    included: ["Tile and grout cleaning", "Fixtures polish", "Floor scrub", "Disinfection"],
    excluded: ["Hard water stain restoration"],
    warranty: "48-hour re-clean promise",
  },
  {
    id: "svc-plumbing-fix",
    categoryId: "cat-plumbing",
    name: "Plumbing repair",
    description: "Fast, reliable help for leaks, fittings, blocks, and small fixes.",
    imageUrl: serviceImages.plumbing,
    startingPrice: "249.00",
    duration: "30–90 min",
    rating: "4.7",
    bookings: 1610,
    accent: "teal",
    included: ["Issue diagnosis", "Minor leak repair", "Fitting tightening", "Work area cleanup"],
    excluded: ["Major replacement parts"],
    warranty: "7-day service warranty",
  },
  {
    id: "svc-switch-repair",
    categoryId: "cat-electrical",
    name: "Switch & socket repair",
    description: "Safe electrical fixes from a verified professional at your doorstep.",
    imageUrl: serviceImages.electrical,
    startingPrice: "199.00",
    duration: "30–60 min",
    rating: "4.8",
    bookings: 1324,
    accent: "amber",
    included: ["Issue diagnosis", "Switch/socket replacement", "Safety check"],
    excluded: ["New wiring and concealed work"],
    warranty: "30-day service warranty",
  },
  {
    id: "svc-home-salon",
    categoryId: "cat-salon",
    name: "At-home salon for women",
    description: "Salon-quality care, brought to the comfort of your home.",
    imageUrl: serviceImages.salon,
    startingPrice: "599.00",
    duration: "60–120 min",
    rating: "4.9",
    bookings: 972,
    accent: "rose",
    included: ["Consultation", "Selected service", "Sanitised tools", "After-care tips"],
    excluded: ["Premium product upgrades"],
    warranty: "Satisfaction-first reservice",
  },
  {
    id: "svc-wall-painting",
    categoryId: "cat-painting",
    name: "Wall painting",
    description: "Give one room a clean new finish with careful prep and tidy work.",
    imageUrl: serviceImages.painting,
    startingPrice: "899.00",
    duration: "2–4 hrs",
    rating: "4.6",
    bookings: 746,
    accent: "orange",
    included: ["Surface prep", "Primer coat", "Two colour coats", "Post-work cleanup"],
    excluded: ["Paint and material costs"],
    warranty: "90-day finish warranty",
  },
];

export const seedProfessionals = [
  {
    id: "pro-amit-sharma",
    name: "Amit Sharma",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    verified: true,
    rating: "4.9",
    totalJobs: 486,
    experience: "8 years",
    skills: ["AC repair", "Cooling systems", "Installation"],
    availability: "Available today",
    startingPrice: "399.00",
    area: "Indiranagar, Bengaluru",
    isOnline: true,
  },
  {
    id: "pro-neha-verma",
    name: "Neha Verma",
    photoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=240&q=80",
    verified: true,
    rating: "4.8",
    totalJobs: 312,
    experience: "5 years",
    skills: ["Deep cleaning", "Home care", "Move-in clean"],
    availability: "Available tomorrow",
    startingPrice: "299.00",
    area: "Koramangala, Bengaluru",
    isOnline: true,
  },
  {
    id: "pro-rohit-nair",
    name: "Rohit Nair",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
    verified: true,
    rating: "4.7",
    totalJobs: 228,
    experience: "6 years",
    skills: ["Plumbing", "Water heaters", "Fixtures"],
    availability: "Available today",
    startingPrice: "249.00",
    area: "HSR Layout, Bengaluru",
    isOnline: true,
  },
];

export async function ensureSeeded(): Promise<void> {
  await db.insert(usersTable).values({
    id: "user-demo",
    name: "Aarav Mehta",
    phone: "+91 90000 12345",
    email: "aarav@example.com",
    role: "customer",
  }).onConflictDoNothing();

  await db.insert(categoriesTable).values(seedCategories).onConflictDoNothing();
  await db.insert(servicesTable).values(seedServices).onConflictDoNothing();
  await db.insert(professionalsTable).values(seedProfessionals).onConflictDoNothing();

  await db.insert(bookingsTable).values({
    id: "booking-ac-001",
    userId: "user-demo",
    serviceId: "svc-ac-service",
    professionalId: "pro-amit-sharma",
    status: "ongoing",
    scheduledAt: new Date("2026-09-20T15:30:00+05:30"),
    address: "24, 12th Main Road, Indiranagar, Bengaluru",
    total: "449.00",
    eta: "Arriving in 18 min",
    progress: 62,
    instructions: "Please call on arrival.",
    paymentMethod: "upi",
  }).onConflictDoNothing();
}

export async function getServices(filters?: { category?: string; search?: string }) {
  const conditions = [];
  if (filters?.category) conditions.push(eq(servicesTable.categoryId, filters.category));
  if (filters?.search) {
    const search = `%${filters.search}%`;
    conditions.push(or(ilike(servicesTable.name, search), ilike(servicesTable.description, search)));
  }
  const rows = await db.select().from(servicesTable).where(conditions.length ? and(...conditions) : undefined);
  return rows.map(toService);
}

export function toService(row: typeof seedServices[number] | typeof servicesTable.$inferSelect) {
  return {
    id: row.id,
    categoryId: row.categoryId,
    name: row.name,
    description: row.description,
    imageUrl: row.imageUrl,
    startingPrice: Number(row.startingPrice),
    duration: row.duration,
    rating: Number(row.rating),
    bookings: row.bookings,
    accent: row.accent,
  };
}

export function toProfessional(row: typeof seedProfessionals[number] | typeof professionalsTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    photoUrl: row.photoUrl,
    verified: row.verified,
    rating: Number(row.rating),
    totalJobs: row.totalJobs,
    experience: row.experience,
    skills: row.skills,
    availability: row.availability,
    startingPrice: Number(row.startingPrice),
    area: row.area,
  };
}

export async function getBookingView(id: string) {
  const [row] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
  if (!row) return undefined;
  const [service, professional] = await Promise.all([
    db.select().from(servicesTable).where(eq(servicesTable.id, row.serviceId)),
    row.professionalId
      ? db.select().from(professionalsTable).where(eq(professionalsTable.id, row.professionalId))
      : Promise.resolve([]),
  ]);
  if (!service[0] || !professional[0]) return undefined;
  return {
    id: row.id,
    service: toService(service[0]),
    professional: toProfessional(professional[0]),
    status: row.status,
    scheduledAt: row.scheduledAt.toISOString(),
    address: row.address,
    total: Number(row.total),
    eta: row.eta,
    progress: row.progress,
  };
}