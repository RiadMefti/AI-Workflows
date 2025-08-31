import LlmFactory from "../../llm/LlmFactory";
import type { LlmConfig, Llms, ChatMessage } from "../../types";
import type LlmTask from "../../llm/LlmTask";
import { systemRequirements } from "./prompts";

export default class LlmRouter {
  private _routes: Map<string, LlmTask> = new Map();

  private _llm;
  constructor(llms: Llms, llmConfig: LlmConfig) {
    this._llm = LlmFactory(llms, llmConfig);
  }

  public addSpecialRoute(route: LlmTask, name: string): LlmRouter {
    this._routes.set(name, route);
    return this;
  }

  private _createPrompt(input: string): ChatMessage[] {
    let prompt = "\nAvailable routes:\n";
    for (let [key, value] of this._routes) {
      prompt += `- ${key}: ${value.systemRequirements}\n`;
    }
    prompt += `\nYou MUST respond with exactly one of: ${Array.from(
      this._routes.keys()
    ).join(", ")}`;

    const routeMessages: ChatMessage[] = [
      { role: "system", content: systemRequirements + prompt },
      { role: "user", content: input },
    ];

    return routeMessages;
  }
  public async routeRequest(input: string): Promise<string> {
    const route = await this._llm.GetCompletion(this._createPrompt(input));

    const specializedRoute = this._routes.get(route);

    if (specializedRoute) {
      return await specializedRoute.execute(input);
    }

    throw new Error(
      `Route "${route}" was not found. LLM returned: "${route}", available routes: [${Array.from(
        this._routes.keys()
      ).join(", ")}]`
    );
  }
}
