import { BaseChatModel, CompletionsRes } from './baseChatModel';

export class YiRuoCloudChatModel extends BaseChatModel {
  completions(req: any): Promise<CompletionsRes> {
    throw new Error('Method not implemented.');
  }
}
