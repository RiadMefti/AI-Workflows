export default interface ILlm {
  GetCompletion(messages: object[]): Promise<string>;
}
