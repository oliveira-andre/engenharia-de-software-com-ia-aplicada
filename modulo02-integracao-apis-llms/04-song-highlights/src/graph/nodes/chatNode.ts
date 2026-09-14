import type { Runtime } from '@langchain/langgraph';
import { OpenRouterService } from '../../services/openrouterService.ts';
import type { GraphState } from '../graph.ts';
import { ChatResponseSchema, getSystemPrompt, getUserPromptTemplate } from '../../prompts/v1/chatResponse.ts';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

export function createChatNode(llmClient: OpenRouterService) {
  return async (state: GraphState, runtime?: Runtime): Promise<Partial<GraphState>> => {

    const userContext = '';
    const systemPrompt = getSystemPrompt(userContext);

    const conversationHistory = state.messages
      .map(msg => `${HumanMessage.isInstance(msg) ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n');

    const userMessage = state.messages.at(-1)?.text as string;
    const userPrompt = getUserPromptTemplate(
      userMessage,
      conversationHistory
    );

    const result = await llmClient.generateStructured(
      systemPrompt,
      userPrompt,
      ChatResponseSchema
    );

    if (!result.success || !result.data) {
      console.error('Failed to generate chat response:', result.error);
      return {
        messages: [
          new AIMessage("Desculpe, encontrei um error poderia tentar novamente?"),
        ],
      };
    }


    const response = result.data;
    
     return {
      messages: [
        new AIMessage(response.message),
      ],
      extractedPreferences: response.shouldSavePreferences ? response.preferences : undefined,
      needsSummarization: false,
    };
  };
}
