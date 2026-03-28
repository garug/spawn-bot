export const env = {
    cronKey: Deno.env.get("CRON_KEY") ?? "",
    frontendUrl: Deno.env.get("FRONTEND_URL") ?? "",
    mongoUri: Deno.env.get("DB_MONGO_URL") ?? "mongodb://localhost:27017/test",
    discordBotToken: Deno.env.get("DISCORD_BOT_TOKEN") ?? "",
    discordChannelId: Deno.env.get("DISCORD_CHANNEL_ID") ?? "",
    discordPublicKey: Deno.env.get("DISCORD_PUBLIC_KEY") ?? "",
};
