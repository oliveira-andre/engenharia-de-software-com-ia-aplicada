import { OpenRouterService } from '../../services/openrouterService.ts';
import type { GraphState } from '../state.ts';

export const createGuardrailsCheckNode = (openRouterService: OpenRouterService) => {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        try {
            const lastMessage = state.messages.at(-1)?.text ?? '';

            return {
                guardrailCheck: {
                    safe: true
                }
            };
        } catch (error) {
            console.error('Guardrails check failed:', error);

            return {
                guardrailCheck: {
                    reason: 'Guardrails service unavailable - request blocked for safety',
                    safe: false
                }
            };
        }
    }
}
