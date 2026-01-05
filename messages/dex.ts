import { DiscordMessage } from "@infra/discord/discord.types.ts";

const repo = useRepository();

export async function handleDex(message: DiscordMessage) {

}

// messages/dex/dex.embed.ts
import type { DiscordEmbed } from "@infra/discord/discord.types.ts";

export function buildDexEmbed(params: {
  userId: string;
  uniquePokemon: number;
  strongestNames: string[];
  frontendUrl: string;
  dexTotal?: number;
}): DiscordEmbed {
  const {
    userId,
    uniquePokemon,
    strongestNames,
    frontendUrl,
    dexTotal = 493,
  } = params;

  return {
    color: 0xf39c12,
    description: [
      `<@${userId}> dex: ${uniquePokemon}/${dexTotal}`,
      "",
      `Strongest pokemon: ${strongestNames.join(", ") || "—"}`,
      "",
    //   `Full dex: ${frontendUrl}/usuarios/${userId}`,
    ].join("\n"),
  };
}
