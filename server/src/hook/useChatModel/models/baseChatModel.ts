import axios, { Axios } from "axios";

export class CompletionsReq {
  model: string;
  messages: MessageType[];
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  maxTokens?: number;
  url?: string;
  apikey?: string;
  appKey?: string;
  appSecret?: string;
}

export class CompletionsRes {
  raw: any;
  state: boolean;
  message?: MessageType;
}

export class MessageType {
  content: string;
  role: string;
}

export abstract class BaseChatModel {
  protected client: Axios;
  constructor() {
    this.client = axios.create({});
  }

  abstract completions(req: CompletionsReq): Promise<CompletionsRes>;
}
