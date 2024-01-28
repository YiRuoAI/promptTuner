import { BaseChatModel, CompletionsReq, CompletionsRes } from './baseChatModel';

export class OpenAiChatModel extends BaseChatModel {
  private url = 'https://api.openai.com/v1/chat/completions';

  async completions(req: CompletionsReq): Promise<CompletionsRes> {
    let url = this.url;
    if (req.url) {
      url = req.url;
    }

    try{
      const res = await this.client.post(url, {
        messages: req.messages,
        temperature: req.temperature,
        top_p: req.topP,
        max_tokens: req.maxTokens,
        presence_penalty: req.presencePenalty,
        frequency_penalty: req.frequencyPenalty,
      }, {
        headers: {
          Authorization: `Bearer ${req.apikey}`,
        },
      });
      
  
      if (res.data.error) {
        return {
          raw: res.data,
          state: false,
        }
      }
      return {
        raw: res.data,
        state: true,
        message: { role: 'assistant', content: res.data.choices[0].message.content },
      }
    }catch(e){
      return {
        raw: e,
        state: false,
      }
    }
  }
}
