export type DiscordMessage = {
    author: { id: string; mention?: string };
    channel: {
        send: (payload: DiscordSendPayload) => Promise<unknown>;
    };
};

export type DiscordSendPayload = {
    embeds: Array<{
        color?: number;
        description?: string;
    }>;
};

export type DiscordEmbed = {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
};
