import { OpenRouterService } from '../../services/openrouterService.ts';
import { Neo4jService } from '../../services/neo4jService.ts';
import type { GraphState } from '../graph.ts';
import { CypherQuerySchema, getSystemPrompt, getUserPromptTemplate } from '../../prompts/v1/cypherGenerator.ts';
import { SALES_CONTEXT } from '../../prompts/v1/salesContext.ts';

function getCurrentStepQuestion(state: GraphState) {
  if (!state.isMultiStep || !state.subQuestions?.length || state.currentStep === undefined) {
    return null;
  }

  if (state.currentStep >= state.subQuestions.length) {
    return null;
  }

  return {
    question: state.subQuestions[state.currentStep],
    stepNumber: state.currentStep + 1,
  };
}

export function createCypherCorrectionNode(
  llmClient: OpenRouterService,
  neo4jService: Neo4jService,
) {

  return async (state: GraphState): Promise<Partial<GraphState>> => {

    try {

      const stepInfo = getCurrentStepQuestion(state);
      const targetQuestion = stepInfo?.question ?? state.question!;

      if (stepInfo) {
        const totalSteps = state?.subQuestions?.length ?? 0;
        console.log(`Generating cyberquery for step: ${stepInfo.stepNumber} of ${totalSteps}`);
      } else {
        console.log(`Generating cyberquery for the main question`);
      }

      const schema = await neo4jService.getSchema();
      const systemPrompt = await getSystemPrompt(schema, SALES_CONTEXT);
      const userPrompt = await getUserPromptTemplate(targetQuestion);

      const { data, error } = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        CypherQuerySchema,
      );

      if (error) {
        return {
          error: `Query generation failed: ${error ?? 'Unknown error'}`,
        }
      }

      console.log('Generated cypher query data: ', data?.query);

      if (state.isMultiStep && state.subQueries?.length) {
        return {
          query: data?.query,
          subQueries: [...state.subQueries, data?.query || ''],
        }
      }

      return {
        query: data?.query,
      };
    } catch (error: any) {
      console.error('Error correcting query:', error.message);
      return {
        ...state,
        error: `Query correction failed: ${error.message}`,
      };
    }
  };
}
