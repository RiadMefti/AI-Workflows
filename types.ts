export enum Llms {
  OpenAI,
}
export type LlmConfig = {
  token: string;
  endpoint: string;
  modelName: string;
};
