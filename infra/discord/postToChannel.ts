import { env } from "@config/env.ts";

const DISCORD_API = "https://discord.com/api/v10";

export async function postToChannel(
    channelId: string,
    payload: { content?: string; embeds?: object[] },
): Promise<void> {
    const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${env.discordBotToken}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const body = await res.text();
        console.error(`Failed to post to channel ${channelId}: ${res.status} ${body}`);
    }
}
