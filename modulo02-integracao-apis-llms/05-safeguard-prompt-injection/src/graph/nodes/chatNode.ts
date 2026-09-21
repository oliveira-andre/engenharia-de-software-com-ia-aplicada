import type { GraphState } from '../state.ts';
import { AIMessage } from '@langchain/core/messages';
import { OpenRouterService } from '../../services/openrouterService.ts';
import { PromptTemplate } from '@langchain/core/prompts';
import { prompts } from '../../config.ts';

export const createChatNode = (openRouterService: OpenRouterService) => {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        try {
            const userPrompt = state.messages.at(-1)?.text!
            const template = PromptTemplate.fromTemplate(prompts.system);
            const systemPrompt = await template.format({
                USER_ROLE: state.user.role,
                USER_NAME: state.user.displayName,
            });

            const response = await openRouterService.generate(
                systemPrompt,
                userPrompt
            );

            return {
                messages: [...state.messages, new AIMessage(response)],
            };
        } catch (error) {
            console.error('Chat node error:', error);
            return {
                messages: [new AIMessage('I apologize, but I encountered an error processing your request. Please try again later.')],
            };
        }
    }
}
