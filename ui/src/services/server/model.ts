import { getIntl, request } from '@umijs/max';
/**
   * @en-US International configuration
   * @zh-CN 国际化配置
* */
const intl = getIntl();

/**
   * @en-US provider
   * @zh-CN 模型服务商
* */
export enum Provider {
  openai = 'openai',
  azure = 'azure',
  yiruocloud = 'yiruocloud',
}

export const ProviderLabel = {
  [Provider.openai]: intl.formatMessage({ id: 'pages.modelList.provider.openai' }),
  [Provider.azure]: intl.formatMessage({ id: 'pages.modelList.provider.azure' }),
  [Provider.yiruocloud]: intl.formatMessage({ id: 'pages.modelList.provider.yiruocloud' }),
};

export const ModelType = {
  'gpt-3.5-turbo-1106': 'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k': 'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0613': 'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-16k-0613': 'gpt-3.5-turbo-16k-0613',
  'gpt-3.5-turbo-0301': 'gpt-3.5-turbo-0301',
  'gpt-4-1106-preview': 'gpt-4-1106-preview',
  'gpt-4': 'gpt-4',
  'gpt-4-32k': 'gpt-4-32k',
  'gpt-4-0613': 'gpt-4-0613',
  'gpt-4-32k-0613': 'gpt-4-32k-0613',
}

export const ProviderUrl = {
  [Provider.openai]: 'https://api.openai.com/v1/chat/completions',
  [Provider.azure]: 'https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/chat/completions?api-version={api-version}',
  [Provider.yiruocloud]: 'https://api.yiruocloud.com/chat/completions',
};


export enum AuthType {
  Authentication,
  Sign,
}

export async function create(req: ServerAPI.createModelReq) {
  return request<{ data: string }>('/model/create', {
    method: 'POST',
    data: req,
  });
}

export async function update(req: ServerAPI.updateModelReq) {
  return request<{ data: string }>('/model/update', {
    method: 'POST',
    data: req,
  });
}

export async function del(id: string) {
  return request<{ data: string }>('/model/delete', {
    method: 'DELETE',
    params: { id },
  });
}

export async function list(req: ServerAPI.listModelReq): Promise<{ data: { list: ServerAPI.ModelListItem[], total: number } }> {
  return request('/model/list', {
    method: 'GET',
    params: {
      page: req.current,
      pageSize: req.pageSize,
      name: req.name,
      provider: req.provider,
      type: req.type,
    },
  });
}

