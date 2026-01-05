import type { PipelineStage } from "mongoose";
import { withTotalPower } from "../findStrongest/pipelines.ts";

export const tiersSourceAggregate: PipelineStage[] = [
    ...withTotalPower,
    { $sort: { total: -1 } },
    {
        $group: {
            _id: "$id_dex",
            arr: { $push: { total: "$total" } },
        },
    },
];
