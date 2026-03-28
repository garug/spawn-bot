import { env } from "@config/env.ts";

import { SpawnAnnouncer } from "@domain/spawn/ports/announcer.ts";
import { ActiveSpawn } from "@domain/spawn/spawn.types.ts";

async function announceAppear(spawn: ActiveSpawn) {
    if (!spawn.value) return false;
}

async function announceRun(spawn: ActiveSpawn) {
    if (!spawn.value) return false;

    await fetch(`https://discord.com/api/v10/channels/${env.discordChannelId}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${env.discordBotToken}`
        },
        body: JSON.stringify({
            embeds: [
                {
                    color: 0xf39c12,
                    description: `Oh no!! The ${spawn.value.name} run away!`,
                },
            ],
        })
    })
}

export function createSpawnAnnouncerDiscord(): SpawnAnnouncer {
    return {
        announceAppear,
        announceRun
    };
}