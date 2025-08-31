import LlmTask from "./llm/LlmTask";
import { Llms, type LlmConfig } from "./types";
import { PromptChain } from "./workflows/promptChaining/PromptChain";

const token = process.env.GITHUB_TOKEN || "";
const endpoint = "https://models.github.ai/inference";
const modelName = "mistral-ai/mistral-medium-2505";

const llmConfig: LlmConfig = { token, endpoint, modelName };
