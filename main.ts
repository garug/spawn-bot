import { handleInteraction } from "@infra/discord/interactions/handler.ts";

Deno.serve((req) => {
  return handleInteraction(req);
});
