export const env = {
    cronKey: Deno.env.get("CRON_KEY") ?? "",
    frontendUrl: Deno.env.get("FRONTEND_URL") ?? "",
    mongoUri: Deno.env.get("DB_MONGO_URL") ?? "mongodb://localhost:27017/test",
    discordPublicKey: Deno.env.get("DISCORD_PUBLIC_KEY") ?? "",
    discordBotToken: Deno.env.get("DISCORD_BOT_TOKEN") ?? "",
    discordSpawnChannelId: Deno.env.get("DISCORD_SPAWN_CHANNEL_ID") ?? "",
};
