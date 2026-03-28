import { env } from "@config/env.ts";

import { SpawnAnnouncer } from "@domain/spawn/ports/announcer.ts";
import { ActiveSpawn } from "@domain/spawn/spawn.types.ts";
import { traced } from "@infra/telemetry.ts";

const RARE_POKEMON_CHANCE = 0.0005;

async function post(body: object): Promise<void> {
    await traced("discord.post", async () => {
        const res = await fetch(`https://discord.com/api/v10/channels/${env.discordChannelId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${env.discordBotToken}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) console.error(`Discord post failed: ${res.status} ${await res.text()}`);
    });
}

async function announceAppear(spawn: ActiveSpawn) {
    if (!spawn.value) return;

    const { name, shiny, chance, image } = spawn.value;
    const shinyMessage = shiny ? " ✨✨✨" : "";

    await post({
        embeds: [{
            color: 0xf39c12,
            title: "A wild pokemon appeared",
            description: "Who's that pokemon?" + shinyMessage,
            footer: { text: `Chance of that pokemon: ${(chance * 100).toFixed(3)}%` },
            image: { url: image },
        }],
    });

    if (chance <= RARE_POKEMON_CHANCE) {
        await post({ content: "@everyone a rare pokemon <:eita:875730434087075850>" });
    }
}

async function announceRun(spawn: ActiveSpawn) {
    if (!spawn.value) return;

    await post({
        embeds: [{
            color: 0xf39c12,
            description: `Oh no!! The ${spawn.value.name} run away!`,
        }],
    });
}

export function createSpawnAnnouncerDiscord(): SpawnAnnouncer {
    return {
        announceAppear,
        announceRun
    };
}