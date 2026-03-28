import { trace, SpanStatusCode } from "npm:@opentelemetry/api";
import { logger } from "@infra/logger.ts";

// Deno Deploy e OTEL_DENO=true configuram o provider automaticamente.
// Só registramos um provider local quando rodando fora desses ambientes.
const isDeployManaged = Deno.env.get("DENO_DEPLOYMENT_ID") || Deno.env.get("OTEL_DENO");

if (!isDeployManaged) {
    const { BasicTracerProvider, SimpleSpanProcessor } = await import("npm:@opentelemetry/sdk-trace-base");
    const log = logger("otel");

    class LoggerSpanExporter {
        // deno-lint-ignore no-explicit-any
        export(spans: any[], resultCallback: (result: { code: number }) => void): void {
            for (const span of spans) {
                const durationMs = span.duration[0] * 1000 + span.duration[1] / 1e6;
                const isError = span.status.code === 2;
                const extra: Record<string, unknown> = { duration_ms: Math.round(durationMs) };

                if (Object.keys(span.attributes).length) extra.attributes = span.attributes;
                if (isError) extra.error = span.status.message;

                if (isError) log.error(`span: ${span.name}`, extra);
                else log.info(`span: ${span.name}`, extra);
            }
            resultCallback({ code: 0 });
        }

        shutdown(): Promise<void> {
            return Promise.resolve();
        }
    }

    const provider = new BasicTracerProvider();
    provider.addSpanProcessor(new SimpleSpanProcessor(new LoggerSpanExporter()));
    provider.register();
}

export const tracer = trace.getTracer("spawn-bot");

export async function traced<T>(
    name: string,
    fn: () => Promise<T>,
    attributes?: Record<string, string | number | boolean>,
): Promise<T> {
    return tracer.startActiveSpan(name, { attributes }, async (span) => {
        try {
            const result = await fn();
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (e) {
            span.recordException(e as Error);
            span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
            throw e;
        } finally {
            span.end();
        }
    });
}
