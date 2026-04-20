# spawn-bot

Bot Discord para jogo de spawn e captura de Pokemon. Pokemon aparecem automaticamente no canal em horarios definidos e os usuarios tentam captura-los digitando o nome correto.

## Requisitos

- [Deno](https://deno.land/) v2+
- MongoDB (local ou Atlas)
- Aplicacao Discord com bot token e public key

## Configuracao

Crie um arquivo `.env` baseado no `.env.example`:

```env
FRONTEND_URL=
DB_MONGO_URL=mongodb://localhost:27017/spawn-bot
DISCORD_BOT_TOKEN=
DISCORD_CHANNEL_ID=
DISCORD_PUBLIC_KEY=
API_SECRET=
```

## Rodando

```bash
deno task dev
```

O bot sobe um HTTP server (porta padrão do Deno) e uma cron job de spawn. Configure o endpoint `/interactions` como Interactions Endpoint URL na sua aplicacao Discord.

## Comandos Discord

| Comando | Descricao |
|---|---|
| `/catch <nome>` | Tenta capturar o Pokemon atual do canal |
| `/dex` | Exibe seus Pokemon capturados e progresso |

## API

| Rota | Descricao |
|---|---|
| `POST /interactions` | Webhook de interactions do Discord |
| `POST /api/cache/possibilities` | Limpa o cache de possibilidades (requer `API_SECRET`) |
| `GET /health` | Health check |

## Spawn

Pokemon spawnам nos horarios `0-3h` e `10-23h` (UTC). A logica de probabilidade usa selecao ponderada por tier, com taxa de shiny de 1% e ultra-raro de 0.05%.
