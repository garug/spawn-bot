import { verifyInternalRequest } from "./verifyInternalRequest.ts";
import { spawn } from "@domain/spawn/spawn.ts";
import { spawnAnnouncer, spawnRepository, possibilitiesRepository, infoRepository, pokemonApiRepository } from "@config/container.ts";

export async function handleApi(req: Request): Promise<Response> {
  const url = new URL(req.url);

  const auth = verifyInternalRequest(req);
  if (!auth.ok) return new Response("Unauthorized", { status: 401 });

  // POST /api/spawn-tick — disparo manual/forçado
  if (url.pathname === "/api/spawn-tick" && req.method === "POST") {
    const result = await spawn({
      announcer: spawnAnnouncer(),
      repository: spawnRepository(),
      possibilitiesRepository: possibilitiesRepository(),
      infoRepository: infoRepository(),
      pokemonApiRepository: pokemonApiRepository(),
    });
    return Response.json(result);
  }

  return new Response("Not found", { status: 404 });
}
