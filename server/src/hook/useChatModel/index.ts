import { AzureChatModel } from './models/azure';
import { OpenAiChatModel } from './models/openai';
import { YiRuoCloudChatModel } from './models/yiruocloud';

export function useChatModel(provider: string) {
  switch (provider) {
    case 'openai':
      return new OpenAiChatModel();
    case 'azure':
      return new AzureChatModel();
    case 'yiruocloud':
      return new YiRuoCloudChatModel();
    default:
      return new OpenAiChatModel();
  }
}
