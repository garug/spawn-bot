import { connectDatabase } from "@config/mongo.ts";
// import { handleInteraction } from "@infra/discord/interactions/handler.ts";

let booted = false;
async function boot() {
  if (booted) return;
  await connectDatabase();
  booted = true;
}

Deno.serve(async (req) => {
  await boot();
  return new Response("Not found", { status: 404 });
});
