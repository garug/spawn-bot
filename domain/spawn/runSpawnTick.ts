import { connectDatabase } from "@config/mongo.ts";
import { env } from "@config/env.ts";
import InfoPokemonModel from "@infra/database/mongo/models/InfoPokemon.model.ts";
import SetModel from "@infra/database/mongo/models/Set.model.ts";
import { postToChannel } from "@infra/discord/postToChannel.ts";
import { infoSort, sort } from "./infoSort.ts";
import { getSpawnState, setActivePokemon, clearActivePokemon } from "./spawnState.ts";

const MAX_INTERVAL_MS = 12 * 60 * 1000; // 12 minutos
const SHINY_RATE = 0.01;
export const RARE_POKEMON_CHANCE = 0.0005;

export async function runSpawnTick({ now, force = false }: { now: Date; force?: boolean }): Promise<void> {
    const state = getSpawnState();

    const timeDifference = now.getTime() - state.date.getTime();
    const probability = timeDifference / MAX_INTERVAL_MS;

    if (!force && probability <= Math.random()) return;

    // se tem pokemon ativo, ele foge e não spawna outro ainda
    if (state.pokemon) {
        await connectDatabase();
        await postToChannel(env.discordSpawnChannelId, {
            embeds: [{
                color: 0xf39c12,
                description: `Oh no!! The ${state.pokemon.name} run away!`,
            }],
        });
        clearActivePokemon();
        return;
    }

    await connectDatabase();

    const sets = await SetModel.find({ active: true });
    const possiblePokemon = sets.flatMap((s) => s.pokemon);

    if (possiblePokemon.length === 0) return;

    const { sorted: pickedPokemon, chance: pokemonChance } = infoSort(possiblePokemon, (p) => p.chance);
    const chances = [pokemonChance];

    const info = await InfoPokemonModel.findOne({ id_dex: pickedPokemon.id_dex });
    const form = info?.forms && info.forms.length > 1
        ? sort(info.forms, (f) => f.chance)
        : undefined;

    const apiId = form?.id_api ?? pickedPokemon.id_dex;
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${apiId}/`);
    if (!pokeRes.ok) {
        console.error(`PokeAPI error for id ${apiId}: ${pokeRes.status}`);
        return;
    }
    const pokeData = await pokeRes.json();
    const { name, stats, species } = pokeData;

    const shiny = Math.random() < SHINY_RATE;
    chances.push(shiny ? SHINY_RATE : 1 - SHINY_RATE);

    const chance = chances.reduce((acc, e) => acc * e);

    const pokemonName = form?.name ?? (form?.use_specie_name ? species.name : name);
    const imageUrl: string = form?.image ?? pokeData.sprites.other["official-artwork"].front_default;

    setActivePokemon({
        name: pokemonName,
        form: form?.id,
        stats,
        id: pickedPokemon.id_dex,
        shiny,
        chance,
    });

    const shinyMessage = shiny ? " ✨✨✨" : "";

    await postToChannel(env.discordSpawnChannelId, {
        embeds: [{
            color: 0xf39c12,
            title: "A wild pokemon appeared",
            description: "Who's that pokemon?" + shinyMessage,
            footer: { text: `Chance of that pokemon: ${(chance * 100).toFixed(3)}%` },
            image: { url: imageUrl },
        }],
    });

    if (chance <= RARE_POKEMON_CHANCE) {
        await postToChannel(env.discordSpawnChannelId, {
            content: "@everyone a rare pokemon <:eita:875730434087075850>",
        });
    }
}
