import { verifyInternalRequest } from "./verifyInternalRequest.ts";
// import { runSpawnTick } from "@domain/spawn/runSpawnTick.ts";

export async function handleApi(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // auth única para /api/*
  const auth = verifyInternalRequest(req);
  if (!auth.ok) return new Response("Unauthorized", { status: 401 });

  // POST /api/spawn-tick
  if (url.pathname === "/api/spawn-tick" && req.method === "POST") {
    // await runSpawnTick({ now: new Date() });
    return new Response("ok");
  }

  return new Response("Not found", { status: 404 });
}
