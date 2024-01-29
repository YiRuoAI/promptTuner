import CryptoJS from 'crypto-js'
import { BaseChatModel, CompletionsReq, CompletionsRes } from './baseChatModel';

export class YiRuoCloudChatModel extends BaseChatModel {
  private url = 'https://api.yiruocloud.com/chat/completions';

  async completions(req: CompletionsReq): Promise<CompletionsRes> {
    let url = this.url;
    if (req.url) {
      url = req.url;
    }
    const sign = this.getSignParams(req);

    try {
      const res = await this.client.post(url, {
        messages: req.messages,
        modelConfig: {
          temperature: req.temperature,
          top_p: req.topP,
          max_tokens: req.maxTokens,
        }
      }, {
        headers: sign,
      });


      if (res.data.code !== 0) {
        return {
          raw: res.data,
          state: false,
        }
      }
      return {
        raw: res.data,
        state: true,
        message: { role: 'assistant', content: res.data.data.result },
      }
    } catch (e) {
      return {
        raw: e,
        state: false,
      }
    }
  }

  getSignParams(req: CompletionsReq) {
    const timestamp = Date.now().toString();
    const nonce_str = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // 对参数按key进行字典排序
    const params = { app_key: req.appKey, app_secret: req.appSecret, timestamp, nonce_str };
    const keys = Object.keys(params).sort();
    const str = keys.map(key => `${key}=${params[key]}`).join('&');
    delete params.app_secret;
    // MD5加密
    return { ...params, signature: CryptoJS.MD5(str).toString() };
  }
}
