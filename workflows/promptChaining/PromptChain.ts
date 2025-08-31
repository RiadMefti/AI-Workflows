import type { PromptChainStep } from "./PromptChainStep";

export class PromptChain {
  private _steps: PromptChainStep[] = [];

  public addStep(step: PromptChainStep): PromptChain {
    this._steps.push(step);
    return this;
  }

  public async execute(initialInput: string): Promise<string> {
    let currentInput = initialInput;

    for (const step of this._steps) {
      currentInput = await step.execute(currentInput);
    }

    return currentInput;
  }

  public async executeWithHistory(initialInput: string): Promise<{
    finalResult: string;
    intermediateResults: string[];
  }> {
    let currentInput = initialInput;
    const intermediateResults: string[] = [];

    for (const step of this._steps) {
      currentInput = await step.execute(currentInput);
      intermediateResults.push(currentInput);
    }

    return {
      finalResult: currentInput,
      intermediateResults,
    };
  }
}
