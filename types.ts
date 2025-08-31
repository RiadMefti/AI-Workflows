export enum Llms {
  OpenAI,
  Mistral,
}

export type LlmConfig = {
  token: string;
  endpoint: string;
  modelName: string;
};

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}
