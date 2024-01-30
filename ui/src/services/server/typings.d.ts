declare namespace ServerAPI {
  type ModelListItem = {
    id?: string;
    name?: string;
    provider?: string;
    type?: string;
    desc?: string;
    createdAt?: number;
  }

  type listModelReq = {
    current?: number;
    pageSize?: number;
    name?: string;
    provider?: string;
    type?: string;
  }

  type createModelReq = {
    name: string;
    brief: string;
    provider: string;
    type: string;
    endpoints: any;
    config: any;
  }

  type updateModelReq = {
    id: string;
    name: string;
    brief: string;
    provider: string;
    type: string;
    endpoints: any;
    config: any;
  }

  type PromptListItem = {
    id?: string;
    name?: string;
    prompt?: string;
    createdAt?: number;
  }

  type createPromptReq = {
    name: string;
    prompt?: string;
  }

  type updatePromptReq = {
    id: string;
    name: string;
    prompt: string;
  }

  type listPromptReq = {
    current?: number;
    pageSize?: number;
    name?: string;
  }

  type ModelConfigItem = {
    name: string;
    modelId: string;
    conversationConfig: ConversationConfigItem[];
  }

  enum ConversationType {
    // 使用prompt template
    promptTemplate,
    // 自定义
    custom,
  }

  type ConversationConfigItem = {
    type: ConversationType | string;
    promptTemplateId?: string;
    prompt?: string;
  }

  type InputConfigItem = {
    input: string;
  }

  type TestListItem = {
    id?: string;
    name?: string;
    brief?: string;
    createdAt?: number;
    modelConfig?: ModelConfigItem[];
    inputConfig?: InputConfigItem[];
  }



  type createTestReq = {
    name: string;
    brief?: string;
  }

  type updateTestReq = {
    id: string;
    name?: string;
    brief?: string;
    modelConfig?: ModelConfigItem[];
    inputConfig?: InputConfigItem[];
  }

  type listTestReq = {
    current?: number;
    pageSize?: number;
  }

  type listTestJobReq = {
    current?: number;
    pageSize?: number;
  }

  type TestJobDetailReq = {
    testJobId: string;
  }

  type TestJobListItem = {
    id: string;
    createdAt?: number;
    status?: number;
    modelConfig?: ModelConfigItem[];
    inputConfig?: InputConfigItem[];
  }

  type TestJobItemListItem = {
    id: string;
    createdAt?: number;
    status?: number;
    modelSnapshot?: {
      name: string;
    }
    messages?: any[];
  }

  type TestJobDetail = {
    list: TestJobItemListItem[];
    job: TestJobListItem;
  }

}