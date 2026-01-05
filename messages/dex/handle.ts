import type { DiscordMessage } from "@infra/discord/discord.types.ts";
import { pokemonRepository } from "@config/container.ts";
import { buildDexEmbed } from "./dex.embed.ts";
import { env } from "@config/env.ts";

export async function handleDex(message: DiscordMessage) {
    const repo = pokemonRepository();

    const [page, uniquePokemon] = await Promise.all([
        repo.find(
            { userId: message.author.id },
            { page: 1, size: 6 }
        ),
        repo.uniquePokemon(message.author.id),
    ]);

    const strongestNames = page.content.map((p) => p.name);

    await message.channel.send({
        embeds: [
            buildDexEmbed({
                userId: message.author.id,
                uniquePokemon,
                strongestNames,
                frontendUrl: env.frontendUrl,
            }),
        ],
    });
}
