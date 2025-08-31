import { Mistral } from "@mistralai/mistralai";
import type { LlmConfig, ChatMessage } from "../types";
import type ILlm from "./ILlm";
import type {
  AssistantMessage,
  SystemMessage,
  ToolMessage,
  UserMessage,
} from "@mistralai/mistralai/models/components";

export default class MistralLlm implements ILlm {
  private _client: Mistral;
  private _modelName: string;

  constructor(llmConfig: LlmConfig) {
    this._modelName = llmConfig.modelName;
    this._client = new Mistral({
      apiKey: llmConfig.token,
      serverURL: llmConfig.endpoint,
    });
  }

  public async GetCompletion(messages: ChatMessage[]): Promise<string> {
    const response = await this._client.chat.complete({
      messages,
      model: this._modelName,
    });

    const content = response.choices[0]?.message?.content;
    if (content && typeof content === "string") {
      return content;
    }

    throw new Error("Mistral LLM returned empty or invalid response");
  }
}
