export interface IAction {
  SetProperties(properties: string[]): Promise<this>;
  SetDescription(descriptionText: string): Promise<this>;
  Continue(): Promise<void>;
  DeleteAction(): Promise<void>;
  Edit(): Promise<void>;
}
