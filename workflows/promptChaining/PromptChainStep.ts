import LlmFactory from "../../llm/LlmFactory";
import { Llms, type LlmConfig } from "../../types";

export class PromptChainStep {
  private _llm;
  private _systemRequirements;

  constructor(llms: Llms, llmConfig: LlmConfig, systemRequirements: string) {
    this._llm = LlmFactory(llms, llmConfig);
    this._systemRequirements = systemRequirements;
  }

  public async execute(input: string): Promise<string> {
    const prompt = [
      { role: "system", content: this._systemRequirements },
      { role: "user", content: input },
    ];
    return await this._llm.GetCompletion(prompt);
  }
}
