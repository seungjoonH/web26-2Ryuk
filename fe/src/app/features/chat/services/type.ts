export interface ChatChannel {
  sendMessage(message: string): void;
  subscribe(): void;
  unsubscribe(): void;
}
