import { Possibility } from "@domain/core/possibility.ts";

export interface PossibilitiesRepository {
    findAll(): Promise<Possibility<unknown>[]>;
}
