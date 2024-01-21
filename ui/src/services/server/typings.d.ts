declare namespace ServerAPI {
  type ModelListItem = {
    id?: string;
    name?: string;
    provider?: string;
    type?: string;
    desc?: string;
    createdAt?: number;
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

  type listModelReq = {
    current?: number;
    pageSize?: number;
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
  }

}