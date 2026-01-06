import { handleInteraction } from "@infra/discord/interactions/handler.ts";
import { handleApi } from "./infra/http/handler.ts";

Deno.serve((req) => {
  const url = new URL(req.url);

  if (url.pathname === "/interactions") return handleInteraction(req);
  if (url.pathname.startsWith("/api")) return handleApi(req);

  if (url.pathname === "/health") return Response.json({ ok: true });

  return new Response("Not found", { status: 404 });
});
