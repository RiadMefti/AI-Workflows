import LlmTask from "../../llm/LlmTask";
import type { LlmConfig, Llms } from "../../types";

export interface WorkerTask {
  id: string;
  description: string;
  systemRequirements: string;
  priority: number;
}

export interface OrchestratorResult {
  subtasks: WorkerTask[];
  workerResults: { [taskId: string]: string };
  synthesizedResult: string;
}

export class OrchestratorWorkflow {
  constructor(private llm: Llms, private llmConfig: LlmConfig) {}

  async execute(
    mainTask: string,
    maxSubtasks: number = 5
  ): Promise<OrchestratorResult> {
    const subtasks = await this.orchestrate(mainTask, maxSubtasks);

    
    const workerResults = await this.delegateToWorkers(mainTask, subtasks);

    const synthesizedResult = await this.synthesizeResults(
      mainTask,
      subtasks,
      workerResults
    );

    return {
      subtasks,
      workerResults,
      synthesizedResult,
    };
  }

  private async orchestrate(
    mainTask: string,
    maxSubtasks: number
  ): Promise<WorkerTask[]> {
    const orchestrator = new LlmTask(
      this.llm,
      this.llmConfig,
      `You are a task orchestrator. Your ONLY job is to output valid JSON.

CRITICAL INSTRUCTIONS:
- You MUST respond with ONLY valid JSON
- NO explanations, NO markdown, NO code blocks
- NO text before or after the JSON
- Create 2-${maxSubtasks} subtasks
- Each subtask needs id, description, systemRequirements, priority

OUTPUT EXACTLY THIS JSON STRUCTURE:
{"subtasks": [{"id": "task_1", "description": "specific task", "systemRequirements": "You are an expert in X", "priority": 1}]}`
    );

    let orchestrationResult = await orchestrator.execute(mainTask);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        let jsonContent = orchestrationResult.trim();

        const parsed = JSON.parse(jsonContent);
        return parsed.subtasks || [];
      } catch (error) {
        if (attempt === 3) {
          throw new Error(
            `Failed to parse orchestration result after ${attempt} attempts. Last result: ${orchestrationResult.slice(
              0,
              200
            )}...`
          );
        }

        orchestrationResult = await orchestrator.execute(
          `${mainTask}\n\nRespond with ONLY valid JSON in this exact format: {"subtasks": [{"id": "task_1", "description": "...", "systemRequirements": "...", "priority": 1}]}`
        );
      }
    }

    return [];
  }

  private async delegateToWorkers(
    mainTask: string,
    subtasks: WorkerTask[]
  ): Promise<{ [taskId: string]: string }> {
    const workerPromises = subtasks.map(async (subtask) => {
      const worker = new LlmTask(
        this.llm,
        this.llmConfig,
        subtask.systemRequirements
      );

      const result = await worker.execute(
        `Main task context: ${mainTask}\n\nYour specific subtask: ${subtask.description}`
      );

      return { taskId: subtask.id, result };
    });

    const results = await Promise.all(workerPromises);

    const workerResults: { [taskId: string]: string } = {};
    results.forEach(({ taskId, result }) => {
      workerResults[taskId] = result;
    });

    return workerResults;
  }

  private async synthesizeResults(
    mainTask: string,
    subtasks: WorkerTask[],
    workerResults: { [taskId: string]: string }
  ): Promise<string> {
    const synthesizer = new LlmTask(
      this.llm,
      this.llmConfig,
      "You are a synthesis expert. Combine multiple specialized outputs into a comprehensive, cohesive response that addresses the original task completely."
    );

    const formattedResults = subtasks
      .map((subtask) => {
        const result = workerResults[subtask.id] || "No result available";
        return `=== ${subtask.description} ===\n${result}`;
      })
      .join("\n\n");

    const synthesisPrompt = `Original task: ${mainTask}

Worker results to synthesize:
${formattedResults}

Please provide a comprehensive, well-structured response that integrates all worker outputs to fully address the original task.`;

    return await synthesizer.execute(synthesisPrompt);
  }
}
