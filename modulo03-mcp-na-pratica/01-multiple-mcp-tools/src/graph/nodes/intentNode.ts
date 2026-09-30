import { AIMessage } from 'langchain';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../state.ts';
import { getSystemPrompt } from '../../prompts/v1/agentNode.ts';
import { IntentData, IntentSchema } from '../../prompts/v1/identifyIntent.ts';

export function intentNode(openRouterService: OpenRouterService) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        console.log('🧠 Intent node processing...');
        try {
            const rawQuestion = state.messages.at(-1)!.text as string;
            const result = await openRouterService.generateStructured(
                getSystemPrompt(),
                rawQuestion,
                IntentSchema
            )

            const parsed = result.data as IntentData

            if (!parsed.intent || !parsed.fileType) {
                console.log("Missing intent or file type");
                throw new Error("Missing intent or file type");
            }

            parsed.fileName ??= `data.${parsed.fileType}`;

            console.log(`Extracted file intent: ${parsed.intent}`);
            console.log(`Extracted file type: ${parsed.fileType}`);
            console.log(`Extracted file name: ${parsed.fileName}`);


            return {
                intent: parsed.intent,
                fileContent: parsed.fileContent ?? "",
                fileName: parsed.fileName,
            };

        } catch (error) {
            console.error('Intent node error:', error);
            return {
                messages: [new AIMessage('Sorry, I had trouble understanding the intent. Please rephrase your question or provide more details.')],
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    };
}
