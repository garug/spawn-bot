import { handleInteraction } from "@infra/discord/interactions/handler.ts";
import { handleApi } from "@infra/http/handler.ts";

import { spawnAnnouncer, possibilitiesRepository, spawnRepository, infoRepository, pokemonApiRepository } from "@config/container.ts";

import { spawn } from "@domain/spawn/spawn.ts";

Deno.serve((req) => {
  const url = new URL(req.url);

  if (url.pathname === "/interactions") return handleInteraction(req);
  if (url.pathname.startsWith("/api")) return handleApi(req);

  if (url.pathname === "/health") return Response.json({ ok: true });

  return new Response("Not found", { status: 404 });
});

Deno.cron("Spawn Routine", "* * * * *", async () => {
  await spawn({
    announcer: spawnAnnouncer(),
    repository: spawnRepository(),
    possibilitiesRepository: possibilitiesRepository(),
    infoRepository: infoRepository(),
    pokemonApiRepository: pokemonApiRepository(),
  });
});
