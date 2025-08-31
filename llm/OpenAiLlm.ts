import OpenAI from "openai";

import type { ChatCompletionMessageParam } from "openai/resources";
import type { LlmConfig, ChatMessage } from "../types";
import type ILlm from "./ILlm";
export default class OpenAiLlm implements ILlm {
  private _client: OpenAI;
  private _modelName: string;

  constructor(llmConfig: LlmConfig) {
    this._modelName = llmConfig.modelName;
    this._client = new OpenAI({
      baseURL: llmConfig.endpoint,
      apiKey: llmConfig.token,
    });
  }

  public async GetCompletion(
    messages: ChatMessage[]
  ): Promise<string> {
    const response = await this._client.chat.completions.create({
      messages: messages as ChatCompletionMessageParam[],
      model: this._modelName,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return content;
    }

    throw new Error("OpenAI LLM returned empty response");
  }
}
