import LlmFactory from "./LlmFactory";
import type { LlmConfig, Llms, ChatMessage } from "../types";

export default class LlmTask {
  private _systemRequirements: string;
  private _llm;

  constructor(llms: Llms, llmConfig: LlmConfig, systemRequirements: string) {
    this._llm = LlmFactory(llms, llmConfig);
    this._systemRequirements = systemRequirements;
  }

  get systemRequirements() {
    return this._systemRequirements;
  }

  public async execute(input: string): Promise<string> {
    const prompt: ChatMessage[] = [
      { role: "system", content: this._systemRequirements },
      { role: "user", content: input },
    ];
    return await this._llm.GetCompletion(prompt);
  }
}