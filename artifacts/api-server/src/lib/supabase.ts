type SupabaseValue = string | number | boolean | null | undefined;

export class SupabaseRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly responseBody: string,
  ) {
    super(`Supabase request failed with status ${status}`);
  }
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be configured");
  }
  return { url: url.replace(/\/$/, ""), publishableKey };
}

function buildUrl(resource: string, params?: Record<string, SupabaseValue>) {
  const { url } = getSupabaseConfig();
  const target = new URL(`${url}/rest/v1/${resource}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) target.searchParams.set(key, String(value));
  }
  return target;
}

function headers() {
  const { publishableKey } = getSupabaseConfig();
  return {
    Accept: "application/json",
    apikey: publishableKey,
    Authorization: `Bearer ${publishableKey}`,
  };
}

export async function supabaseGet<T>(
  resource: string,
  params?: Record<string, SupabaseValue>,
): Promise<T> {
  const response = await fetch(buildUrl(resource, params), {
    method: "GET",
    headers: headers(),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new SupabaseRequestError(response.status, body);
  }
  return JSON.parse(body) as T;
}

export async function supabasePost<T>(
  resource: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(buildUrl(resource), {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new SupabaseRequestError(response.status, body);
  }
  return JSON.parse(body) as T;
}