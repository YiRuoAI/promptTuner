import { getIntl } from '@umijs/max';
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

export enum AuthType {
  Authentication,
  Sign,
}

