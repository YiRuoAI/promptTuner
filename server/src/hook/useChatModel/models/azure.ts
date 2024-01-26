import { BaseChatModel, CompletionsRes } from './baseChatModel';

export class AzureChatModel extends BaseChatModel {

  completions(req: any): Promise<CompletionsRes> {
    throw new Error('Method not implemented.');
  }
}
