import type { Attributes } from "@domain/catch/generateAttributes.ts";

export interface CatchRepository {
    create(data: {
        idDex: number;
        name: string;
        form?: string;
        userId: string;
        attributes: Attributes;
        shiny: boolean;
    }): Promise<{ total: number }>;

    incrementPrestige(userId: string, idDex: number): Promise<void>;

    resolveTier(idDex: number, total: number): Promise<string>;
}
