export interface IMessageDelete {
  message: IMessage;
  onMessageDelete: (messageId: string) => void;
}
