import LlmFactory from "./llm/LlmFactory";
import { Llms, type LlmConfig } from "./types";

const token = process.env.GITHUB_TOKEN || "";
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/o4-mini";

const llmConfig: LlmConfig = { token, endpoint, modelName };

const Llm = LlmFactory(Llms.OpenAI, llmConfig);
console.log(
  await Llm.GetCompletion([
    { role: "developer", content: "You are a helpful assistant." },
    { role: "user", content: "What is the capital of France?" },
  ])
);
