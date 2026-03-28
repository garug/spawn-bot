type Level = "info" | "warn" | "error";

function log(level: Level, context: string, message: string, extra?: Record<string, unknown>) {
    const ts = new Date().toISOString();
    const base = `[${ts}] [${level.toUpperCase()}] [${context}] ${message}`;
    const line = extra ? `${base} ${JSON.stringify(extra)}` : base;

    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
}

export function logger(context: string) {
    return {
        info: (message: string, extra?: Record<string, unknown>) => log("info", context, message, extra),
        warn: (message: string, extra?: Record<string, unknown>) => log("warn", context, message, extra),
        error: (message: string, extra?: Record<string, unknown>) => log("error", context, message, extra),
    };
}
