import { env } from "@config/env.ts";

const kv = await Deno.openKv();

function authorized(req: Request): boolean {
  const auth = req.headers.get("Authorization");
  return auth === `Bearer ${env.apiSecret}` && env.apiSecret !== "";
}

export async function handleApi(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "DELETE" && url.pathname === "/api/cache/possibilities") {
    if (!authorized(req)) return new Response("Unauthorized", { status: 401 });
    await kv.delete(["possibilities"]);
    return Response.json({ ok: true });
  }

  return new Response("Not found", { status: 404 });
}
