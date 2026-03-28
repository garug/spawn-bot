import {
    InteractionType,
    InteractionResponseType,
    verifyKey,
} from "discord-interactions";

import { context } from "npm:@opentelemetry/api";
import { env } from "@config/env.ts";
import { connectDatabase } from "@config/mongo.ts";
import { handleDex } from "@messages/dex/handle.ts";
import { handleCatch } from "@messages/catch/handle.ts";
import { spawnRepository, catchRepository } from "@config/container.ts";

export async function handleInteraction(req: Request): Promise<Response> {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const signature = req.headers.get("X-Signature-Ed25519");
    const timestamp = req.headers.get("X-Signature-Timestamp");
    const body = await req.text();

    if (!signature || !timestamp) return new Response("Bad Request", { status: 400 });

    const verified = await verifyKey(body, signature, timestamp, env.discordPublicKey);
    if (!verified) {
        return new Response("Unauthorized", { status: 401 });
    }

    const interaction = JSON.parse(body);

    // PING
    if (interaction.type === InteractionType.PING) {
        return Response.json({ type: InteractionResponseType.PONG });
    }

    // /dex
    if (interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data?.name === "dex") {
        const token = interaction.token as string;
        const appId = interaction.application_id as string;

        const userId = interaction.member?.user?.id ?? interaction.user?.id;
        if (!userId) return new Response("Bad Request", { status: 400 });

        const ctx = context.active();
        queueMicrotask(context.bind(ctx, async () => {
            try {
                await connectDatabase();

                const data = await handleDex(interaction.member.user.id);

                await fetch(`https://discord.com/api/v10/webhooks/${appId}/${token}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        flags: 0,
                        embeds: [{
                            color: 0xf39c12,
                            description: [
                                `<@${userId}> dex: ${data.uniquePokemon}/493`,
                                "",
                                `Strongest pokemon: ${data.strongestNames.join(", ") || "—"}`,
                                "",
                                // `Full dex: ${frontendUrl}/usuarios/${userId}`,
                            ].join("\n")
                        }]
                    }),
                });
            } catch (e) {
                console.error({ interaction, e });
                await fetch(`https://discord.com/api/v10/webhooks/${appId}/${token}/messages/@original`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: "Erro ao executar /dex." }),
                }).catch(() => { });
            }
        }));

        // responde rápido
        return Response.json({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            data: { flags: 64 }
        });
    }

    // /catch
    if (interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data?.name === "catch") {
        const token = interaction.token as string;
        const appId = interaction.application_id as string;

        const userId = interaction.member?.user?.id ?? interaction.user?.id;
        if (!userId) return new Response("Bad Request", { status: 400 });

        const guess: string = interaction.data.options?.[0]?.value ?? "";

        const catchCtx = context.active();
        queueMicrotask(context.bind(catchCtx, async () => {
            try {
                await connectDatabase();

                const { description, ephemeral } = await handleCatch(userId, guess, {
                    spawnRepository: spawnRepository(),
                    catchRepository: catchRepository(),
                });

                await fetch(`https://discord.com/api/v10/webhooks/${appId}/${token}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        flags: ephemeral ? 64 : 0,
                        embeds: [{ color: 0xf39c12, description }],
                    }),
                });
            } catch (e) {
                console.error({ interaction, e });
                await fetch(`https://discord.com/api/v10/webhooks/${appId}/${token}/messages/@original`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: "Erro ao executar /catch." }),
                }).catch(() => { });
            }
        }));

        return Response.json({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            data: { flags: 0 },
        });
    }

    return new Response("Not handled", { status: 400 });
}
