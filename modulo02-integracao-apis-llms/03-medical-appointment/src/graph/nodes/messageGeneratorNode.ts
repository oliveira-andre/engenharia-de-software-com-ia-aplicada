import { getSystemPrompt, getUserPromptTemplate, MessageSchema } from '../../prompts/v1/messageGenerator.ts';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../graph.ts';
import { AIMessage } from 'langchain';

export function createMessageGeneratorNode(llmClient: OpenRouterService) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        console.log(`💬 Generating response message...`);

        try {
            const hasSucceded = state.actionSuccess ? 'success' : 'error';
            const scenario = `${state.intent ?? 'unknown'}_${hasSucceded}`;
            const details = {
                professionalName: state.professionalName,
                datetime: state.datetime,
                patientName: state.patientName,
                error: state.error,
            }

            const systemPrompt = getSystemPrompt();
            const userPrompt = getUserPromptTemplate({ scenario, details });

            const result = await llmClient.generatedStructured(
                systemPrompt,
                userPrompt,
                MessageSchema
            )

            console.log('Message Generated: ', result);

            if (result.error) {
                console.error('❌ Error in message generation:', result.error);

                return {
                    messages: [
                        ...state.messages,
                        new AIMessage('Desculpe! Errei!')
                    ]
                }
            }

            return {
                messages: [
                    ...state.messages,
                ],
            };
        } catch (error) {
            console.error('❌ Error in messageGenerator node:', error);
            return {
                messages: [
                    ...state.messages,
                    new AIMessage('An error occurred while processing your request.')
                ],
            };
        }
    };
}
