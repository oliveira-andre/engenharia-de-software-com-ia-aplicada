import { tool } from "@langchain/core/tools";

import csvtojson from "csvtojson";
import { z } from "zod";

export function getCSVToJSONTool() {
    return tool(
        async ({ csvText }) => {
            const result = await csvtojson().fromString(csvText);
            console.log(`CSV to JSON length: ${result.length}`);
            return JSON.stringify(result);
        },
        {
            name: 'csv_to_json',
            description: 'Converts CSV text to JSON format',
            schema: z.object({
                csvText: z.string().min(1, "CSV text is required")
            })
        }
    );
}


