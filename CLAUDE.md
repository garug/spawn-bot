# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
# Rodar em modo dev (watch)
deno task dev

# Equivalente completo
deno run --env-file=.env --unstable-cron --unstable-otel --allow-net --allow-env --allow-sys=osRelease --allow-read=/.dockerenv --watch main.ts
```

Nao ha build step — Deno executa TypeScript diretamente. Nao ha testes nem linter configurados.

## Arquitetura

Bot Discord para jogo de spawn/captura de Pokemon, rodando em Deno com MongoDB e OpenTelemetry.

**Dois entry points em `main.ts`**:
1. `Deno.serve` — HTTP server nas rotas `/interactions`, `/api`, `/health`
2. `Deno.cron` — rotina de spawn agendada (horas `0-3,10-23`)

**Camadas**:

- `domain/` — logica de negocio pura (spawn, catch, tier, probabilidade). Sem dependencias de infra.
- `infra/` — implementacoes concretas:
  - `infra/database/mongo/` — modelos Mongoose (OwnedPokemon, InfoPokemon, Prestige, Set) e repositorios
  - `infra/database/kv/` — Deno KV para estado do spawn atual
  - `infra/discord/` — handlers de slash commands (`/catch`, `/dex`) e anunciadores
  - `infra/pokeapi/` — client PokeAPI com cache no Deno KV (TTL 7 dias)
  - `infra/telemetry.ts` — setup OpenTelemetry (auto para Deno Deploy, LoggerSpanExporter local)
- `config/container.ts` — injecao de dependencias via factory functions
- `config/env.ts` — schema de variaveis de ambiente
- `messages/` — handlers de resposta dos comandos Discord (separado dos interaction handlers)

**Fluxo principal**:
- Cron dispara spawn → verifica cooldown/probabilidade → seleciona Pokemon ponderado → anuncia no Discord channel
- Usuario digita `/catch <nome>` → Discord envia interaction → handler valida palpite → salva no MongoDB → atualiza tier

**Deno KV** guarda: estado do ultimo spawn e cache do PokeAPI. MongoDB guarda dados permanentes dos usuarios.

**Variaveis de ambiente necessarias** (ver `.env.example`): `FRONTEND_URL`, `DB_MONGO_URL`, `DISCORD_BOT_TOKEN`, `API_SECRET`.

## Convencoes

- Usar `Temporal.Now.instant()` em vez de `new Date()` para timestamps
- Respostas Discord sao sempre deferidas (acknowledge imediato, processamento async) para evitar timeout de 3s
- MongoDB e pre-conectado no startup (`config/mongo.ts`) para evitar cold start nas interactions
- `DENO_DEPLOYMENT_ID` presente = ambiente Deno Deploy (afeta configuracao de telemetria)
