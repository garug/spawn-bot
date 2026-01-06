import mongoose from "mongoose";
import { env } from "./env.ts";

let connected = false;

export async function connectDatabase(): Promise<void> {
    if (connected) return;

    try {
        console.log("Connecting to database...");
        await mongoose.connect(env.mongoUri);

        connected = true;
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting to database", error);
        throw error;
    }
}
