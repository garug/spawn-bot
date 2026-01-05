export const env = {
    frontendUrl: Deno.env.get("FRONTEND_URL") ?? "",
    mongoUri: Deno.env.get("DB_MONGO_URL") ?? "mongodb://localhost:27017/test",
};
