import type { ChatMessage } from "../types";

export default interface ILlm {
  GetCompletion(messages: ChatMessage[]): Promise<string>;
}
