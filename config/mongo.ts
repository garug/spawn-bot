import mongoose from "mongoose";
import { env } from "./env.ts";
import { traced } from "@infra/telemetry.ts";

let connectionPromise: Promise<void> | null = null;

export async function connectDatabase(): Promise<void> {
    if (mongoose.connection.readyState === 1) return;
    if (connectionPromise) return connectionPromise;

    connectionPromise = traced("mongo.connect", async () => {
        try {
            console.log("Connecting to database...");
            await mongoose.connect(env.mongoUri);
            console.log("Database connected");
        } catch (error) {
            connectionPromise = null;
            console.error("Error connecting to database", error);
            throw error;
        }
    });

    return connectionPromise;
}
