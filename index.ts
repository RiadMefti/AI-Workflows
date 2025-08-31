import { Llms, type LlmConfig } from "./types";
import { PromptChain } from "./workflows/promptChaining/PromptChain";
import { PromptChainStep } from "./workflows/promptChaining/PromptChainStep";

const token = process.env.GITHUB_TOKEN || "";
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/o4-mini";

const llmConfig: LlmConfig = { token, endpoint, modelName };

const file = Bun.file("./utils/sampleAiText.md");
const text = await file.text();
const chain = new PromptChain()
  .addStep(new PromptChainStep(Llms.OpenAI, llmConfig, "Summarize this text"))
  .addStep(
    new PromptChainStep(
      Llms.OpenAI,
      llmConfig,
      "Extract key points from the summary"
    )
  )
  .addStep(
    new PromptChainStep(
      Llms.OpenAI,
      llmConfig,
      "Convert key points to action items"
    )
  );

await chain.executeWithHistory(text);
