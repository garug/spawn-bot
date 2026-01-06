import { env } from "@config/env.ts";

export function verifyInternalRequest(req: Request): { ok: true } | { ok: false } {
    const key = req.headers.get("x-cron-key");
    if (!key) return { ok: false };

    const a = new TextEncoder().encode(key);
    const b = new TextEncoder().encode(env.cronKey);

    if (a.length !== b.length) return { ok: false };

    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];

    return diff === 0 ? { ok: true } : { ok: false };
}
