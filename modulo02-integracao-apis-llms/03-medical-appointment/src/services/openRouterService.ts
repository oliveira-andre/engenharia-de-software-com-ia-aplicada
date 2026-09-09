import { ChatOpenAI } from "@langchain/openai";
import { config, type ModelConfig } from "../config.ts";
import { z } from "zod/v3";
import { createAgent, providerStrategy, SystemMessage } from "langchain";

export class OpenRouterService {
    private config: ModelConfig;
    private llmClient: ChatOpenAI;

    constructor(configOverride?: ModelConfig) {
        this.config = configOverride ?? config
        this.llmClient = new ChatOpenAI({
            apiKey: this.config.apiKey,
            modelName: this.config.models.at(0),
            temperature: this.config.temperature,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                defaultHeaders: {
                    'Referer': this.config.httpReferer,
                    'X-Title': this.config.xTitle
                }
            },

            // aqui vai a conf dos model (smart models)
            modelKwargs: {
                models: this.config.models,
                provider: this.config.provider
            }
        })
    }

    async generatedStructured<T>(
      systemPrompt: string,
      userPrompt: string,
      schema: z.ZodSchema<T>
    ) {
    try {
        const agent = createAgent({
        model: this.llmClient,
        tools: [],
        responseFormat: providerStrategy(schema)
      });

      const messages = [
        new SystemMessage(systemPrompt),
        new SystemMessage(userPrompt)
      ]

      const data = await agent.invoke({ messages });
      return {
        success: true,
        data: data.structuredResponse,
      }
    } catch (error) {
        console.error("Error Open Router Service:", error)
        return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
}