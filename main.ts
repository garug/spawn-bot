import "@infra/telemetry.ts";
import { handleInteraction } from "@infra/discord/interactions/handler.ts";
import { handleApi } from "@infra/http/handler.ts";
import { connectDatabase } from "@config/mongo.ts";

import { spawnAnnouncer, possibilitiesRepository, spawnRepository, infoRepository, pokemonApiRepository } from "@config/container.ts";

import { spawn } from "@domain/spawn/spawn.ts";
import { logger } from "@infra/logger.ts";
import { traced, tracer } from "@infra/telemetry.ts";

const log = logger("cron:spawn");

// Pre-warm MongoDB connection on isolate startup so interactions don't pay the cold-start cost
connectDatabase().catch((e) => log.error("initial db connect failed", { error: String(e) }));

Deno.serve((req) => {
  const url = new URL(req.url);

  if (url.pathname === "/interactions") {
    const span = tracer.startSpan("interaction");
    return handleInteraction(req, span);
  }
  if (url.pathname.startsWith("/api")) return handleApi(req);

  if (url.pathname === "/health") return Response.json({ ok: true });

  return new Response("Not found", { status: 404 });
});

Deno.cron("Spawn routine", "* 0-3,10-23 * * *", async () => {
  log.info("tick");

  await traced("cron.spawn", async () => {
    const result = await spawn({
      announcer: spawnAnnouncer(),
      repository: spawnRepository(),
      possibilitiesRepository: possibilitiesRepository(),
      infoRepository: infoRepository(),
      pokemonApiRepository: pokemonApiRepository(),
    });

    switch (result.status) {
      case "skipped":
        log.info(`skipped: ${result.reason}`, result.reason === "probability"
          ? { probability: `${(result.probability * 100).toFixed(1)}%`, elapsed: `${Math.round(result.elapsedMs / 1000)}s` }
          : undefined);
        break;
      case "ran-away":
        log.info(`ran away: ${result.pokemon}`);
        break;
      case "spawned":
        log.info(`spawned: ${result.pokemon}`, {
          id_dex: result.id_dex,
          chance: `${(result.chance * 100).toFixed(3)}%`,
          shiny: result.shiny,
          rare: result.rare,
        });
        break;
    }
  }).catch((e) => {
    log.error("unhandled error", { error: String(e) });
  });
});
