import LlmTask from "../../llm/LlmTask";
import type { LlmConfig, Llms } from "../../types";

// Interface for defining sectioning subtasks
export interface SectioningTask {
  subtask: string;
  systemRequirements: string;
}

// Interface for parallelization workflow results
export interface ParallelizationResult {
  results: string[];
  aggregatedResult?: string;
}

export class ParallelizationWorkflow {
  constructor(private llm: Llms, private llmConfig: LlmConfig) {}

  async sectioning(
    mainTask: string,
    subtasks: SectioningTask[]
  ): Promise<ParallelizationResult> {
    // Create specialized LLM tasks for each subtask
    const tasks = subtasks.map(
      (subtask) =>
        new LlmTask(this.llm, this.llmConfig, subtask.systemRequirements)
    );

    // Execute all subtasks in parallel
    const promises = tasks.map((task, index) =>
      task.execute(`${mainTask}\n\nFocus on: ${subtasks[index]?.subtask || ""}`)
    );

    const results = await Promise.all(promises);

    return {
      results,
    };
  }

  async sectioningWithAggregation(
    mainTask: string,
    subtasks: SectioningTask[],
    aggregationSystemRequirements: string
  ): Promise<ParallelizationResult> {
    // Step 1: Run parallel sectioning
    const sectioningResult = await this.sectioning(mainTask, subtasks);

    // Step 2: Create aggregation task to combine results
    const aggregationTask = new LlmTask(
      this.llm,
      this.llmConfig,
      aggregationSystemRequirements
    );

    // Step 3: Combine all subtask results
    const combinedResults = sectioningResult.results.join(
      "\n\n--- Subtask Result ---\n\n"
    );

    // Step 4: Generate final aggregated response
    const aggregatedResult = await aggregationTask.execute(
      `Original task: ${mainTask}\n\nSubtask results:\n${combinedResults}\n\nPlease provide a comprehensive aggregated response.`
    );

    return {
      ...sectioningResult,
      aggregatedResult,
    };
  }
}
