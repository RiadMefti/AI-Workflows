import type ILlm from "./Illm";
import OpenAiLlm from "./OpenAiLlm";
import { Llms, type LlmConfig } from "../types";

export default function LlmFactory(llms: Llms, llmConfig: LlmConfig): ILlm {
  switch (llms) {
    case Llms.OpenAI:
      return new OpenAiLlm(llmConfig);
  }
}
