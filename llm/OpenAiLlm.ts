import OpenAI from "openai";
import type ILlm from "./Illm";
import type { ChatCompletionMessageParam } from "openai/resources";
import type { LlmConfig } from "../types";
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
    messages: ChatCompletionMessageParam[]
  ): Promise<string> {
    const response = await this._client.chat.completions.create({
      messages,
      model: this._modelName,
    });

    if (response.choices[0]?.message.content) {
      return response.choices[0].message.content;
    }

    throw new Error("No response sent by the LLM");
  }
}
