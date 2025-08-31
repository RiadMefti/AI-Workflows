import OpenAiLlm from "./OpenAiLlm";
import { Llms, type LlmConfig } from "../types";
import type ILlm from "./ILlm";

export default function LlmFactory(llms: Llms, llmConfig: LlmConfig): ILlm {
  switch (llms) {
    case Llms.OpenAI:
      return new OpenAiLlm(llmConfig);
  }
}
