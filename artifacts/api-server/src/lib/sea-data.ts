import { and, eq } from "drizzle-orm";
import {
  db,
  professionalsTable,
  usersTable,
} from "@workspace/db";
import { supabaseGet, supabasePost } from "./supabase";

type SupabaseRow = Record<string, unknown>;

const firstValue = (row: SupabaseRow, ...keys: string[]) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return undefined;
};

const textValue = (row: SupabaseRow, ...keys: string[]) =>
  String(firstValue(row, ...keys) ?? "");

const numberValue = (row: SupabaseRow, ...keys: string[]) => {
  const value = Number(firstValue(row, ...keys) ?? 0);
  return Number.isFinite(value) ? value : 0;
};

const stringArrayValue = (row: SupabaseRow, ...keys: string[]) => {
  const value = firstValue(row, ...keys);
  return Array.isArray(value) ? value.map(String) : [];
};

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

export async function ensureLocalSeeded(): Promise<void> {
  await db.insert(usersTable).values({
    id: "user-demo",
    name: "Aarav Mehta",
    phone: "+91 90000 12345",
    email: "aarav@example.com",
    role: "customer",
  }).onConflictDoNothing();

  await db.insert(professionalsTable).values(seedProfessionals).onConflictDoNothing();
}

export function toCategory(row: SupabaseRow) {
  return {
    id: textValue(row, "id"),
    name: textValue(row, "name"),
    icon: textValue(row, "icon") || "House",
    serviceCount: numberValue(row, "service_count", "serviceCount"),
  };
}

export function toService(row: SupabaseRow) {
  return {
    id: textValue(row, "id"),
    categoryId: textValue(row, "category_id", "categoryId"),
    name: textValue(row, "name"),
    description: textValue(row, "description"),
    imageUrl: textValue(row, "image_url", "imageUrl"),
    startingPrice: numberValue(row, "starting_price", "startingPrice", "price"),
    duration: textValue(row, "duration") || "30–60 min",
    rating: numberValue(row, "rating"),
    bookings: numberValue(row, "bookings", "booking_count"),
    accent: textValue(row, "accent") || "blue",
  };
}

export function toProfessional(row: SupabaseRow) {
  return {
    id: textValue(row, "id"),
    name: textValue(row, "name"),
    photoUrl: textValue(row, "photo_url", "photoUrl"),
    verified: Boolean(firstValue(row, "verified")),
    rating: numberValue(row, "rating"),
    totalJobs: numberValue(row, "total_jobs", "totalJobs"),
    experience: textValue(row, "experience"),
    skills: stringArrayValue(row, "skills"),
    availability: textValue(row, "availability"),
    startingPrice: numberValue(row, "starting_price", "startingPrice"),
    area: textValue(row, "area"),
  };
}

export async function getSupabaseCategories() {
  const rows = await supabaseGet<SupabaseRow[]>("categories", { select: "*" });
  return rows.map(toCategory);
}

export async function getSupabaseServices(filters?: { category?: string; search?: string }) {
  const rows = await supabaseGet<SupabaseRow[]>("services", { select: "*" });
  const services = rows.map(toService);
  return services.filter((service) => {
    const matchesCategory = !filters?.category || service.categoryId === filters.category;
    const search = filters?.search?.trim().toLowerCase();
    const matchesSearch = !search ||
      service.name.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });
}

export async function getSupabaseService(id: string) {
  const rows = await supabaseGet<SupabaseRow[]>("services", {
    select: "*",
    id: `eq.${id}`,
    limit: "1",
  });
  return rows[0];
}

export async function getLocalProfessional(id?: string) {
  if (id) {
    const [row] = await db.select().from(professionalsTable).where(eq(professionalsTable.id, id));
    if (row) return toProfessional(row);
  }
  return toProfessional(seedProfessionals[0]);
}

export async function getSupabaseBookingRows(filters?: { id?: string; status?: string }) {
  const params: Record<string, string> = { select: "*", order: "scheduled_at.desc" };
  if (filters?.id) params.id = `eq.${filters.id}`;
  if (filters?.status) params.status = `eq.${filters.status}`;
  return supabaseGet<SupabaseRow[]>("bookings", params);
}

export async function toBookingView(row: SupabaseRow) {
  const serviceRow = await getSupabaseService(textValue(row, "service_id", "serviceId"));
  if (!serviceRow) return undefined;
  const professional = await getLocalProfessional(textValue(row, "professional_id", "professionalId"));
  const service = toService(serviceRow);
  return {
    id: textValue(row, "id"),
    service,
    professional,
    status: textValue(row, "status") || "upcoming",
    scheduledAt: new Date(textValue(row, "scheduled_at", "scheduledAt")).toISOString(),
    address: textValue(row, "address"),
    total: numberValue(row, "total", "amount"),
    eta: textValue(row, "eta") || "Professional assignment pending",
    progress: numberValue(row, "progress"),
  };
}

export async function createSupabaseBooking(data: Record<string, unknown>) {
  const rows = await supabasePost<SupabaseRow[]>("bookings", data);
  return rows[0] ? toBookingView(rows[0]) : undefined;
}