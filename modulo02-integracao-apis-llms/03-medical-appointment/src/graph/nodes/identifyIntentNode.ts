import { getSystemPrompt, getUserPromptTemplate, IntentSchema } from '../../prompts/v1/identifyIntent.ts';
import { professionals } from '../../services/appointmentService.ts';
import type { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../graph.ts';

export function createIdentifyIntentNode(llmClient: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`🔍 Identifying intent...`);
   const input = state.messages.at(-1)!.text;

    try {
      const systemPrompt = getSystemPrompt(professionals);
      const userPrompt = getUserPromptTemplate(input);
      const result = await llmClient.generatedStructured(
        systemPrompt,
        userPrompt,
        IntentSchema,
      );

      if (!result.success) {
        console.error('❌ Failed to identify intent:', result.error)

        return {
          intent: 'unknown',
          error: result.error,
        }
      }

      const intentData = result.data!;
      console.log(`✅ Identified intent:`, intentData.intent);
      return {
        ...intentData
      };
    } catch (error) {
      console.error('❌ Error in identifyIntent node:', error);
      return {
        ...state,
        intent: 'unknown',
        error: error instanceof Error ? error.message : 'Intent identification failed',
      };
    }
  };
}
