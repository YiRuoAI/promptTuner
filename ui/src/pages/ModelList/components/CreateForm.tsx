import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import { type FC, useState } from 'react';

import { modelService } from '@/services/server';
import { FormattedMessage, useIntl } from '@umijs/max';

type CreateFormModalProps = {
  visible: boolean;
  current?: ServerAPI.ModelListItem;
  onDone: (
    data?: any,
    id?: string,
  ) => void;
};

const CreateFormModal: FC<CreateFormModalProps> = (props) => {
  const { visible, current, onDone } = props;
  // 新增一个状态来控制高级选项的显示和隐藏
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [authType, setAuthType] = useState(modelService.AuthType.Authentication);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const [form] = Form.useForm();
  const updateProviderUrl = (newValue: string) => {
    form.setFieldsValue({
      endpoints: {
        url: newValue,
      },
    });
  };

  const createOrUpdateApp = async (
    value: any,
  ) => {
    if (!current?.id) {
      await modelService.create(value);
    } else {
      (value as any).id = current.id;
      await modelService.update(value);
    }
    onDone(value, current?.id);
  };
  return (
    <ModalForm<any>
      open={visible}
      form={form}
      title={`${!current?.id ? 
        intl.formatMessage({ id: 'pages.model.create.title.create', defaultMessage: 'create model' }) 
        : intl.formatMessage({ id: 'pages.model.create.title.update', defaultMessage: 'update model' })}`}
      width={640}
      initialValues={current}
      onFinish={createOrUpdateApp}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
      }}
    >
      <ProFormText
        name="name"
        label={<FormattedMessage id="pages.model.create.name" defaultMessage="name" />}
        placeholder={intl.formatMessage({
          id: 'pages.model.create.name.placeholder',
          defaultMessage: 'please enter name',
        })}
        rules={[
          {
            required: true, message: intl.formatMessage({
              id: 'pages.model.create.name.placeholder',
              defaultMessage: 'please enter name',
            })
          },
          {
            max: 20, message: intl.formatMessage({
              id: 'pages.model.create.name.max',
              defaultMessage: 'name max 20 char',
            })
          },
        ]}
      />
      <ProForm.Group>
        <ProFormSelect required width="sm" name="provider"
          label={intl.formatMessage({
            id: 'pages.model.create.provider',
            defaultMessage: 'provider',
          })
          }
          valueEnum={modelService.ProviderLabel}
          onChange={async (value: string) => {

            switch (value) {
              case modelService.Provider.openai:
              case modelService.Provider.azure:
                setAuthType(modelService.AuthType.Authentication);
                updateProviderUrl(modelService.ProviderUrl[value]);
                break;
              case modelService.Provider.yiruocloud:
                setAuthType(modelService.AuthType.Sign);
                updateProviderUrl(modelService.ProviderUrl[value]);
                break;
            }
          }}
        />
        <ProFormSelect required width="sm" name="type"
          label={intl.formatMessage({
            id: 'pages.model.create.type',
            defaultMessage: 'type',
          })}
          valueEnum={modelService.ModelType} />
      </ProForm.Group>

      <ProFormText
        name={['endpoints', 'url']}
        label={<FormattedMessage id="pages.model.create.url" defaultMessage="url" />}
        required
        placeholder={intl.formatMessage({
          id: 'pages.model.create.url.placeholder',
          defaultMessage: 'please enter url',
        })}
        rules={[
          {
            required: true, message: intl.formatMessage({
              id: 'pages.model.create.url.placeholder',
              defaultMessage: 'please enter url',
            })
          },
        ]}
        initialValue={modelService.ProviderUrl[modelService.Provider.openai]}
      />

      {authType === modelService.AuthType.Authentication &&
        <ProFormText
          label='apikey'
          width="md"
          name={['endpoints', 'apiKey']}
        />
      }
      {authType === modelService.AuthType.Sign && (
        <>
          <ProFormText
            label='appKey'
            width="md"
            name={['endpoints', 'appKey']}
          />
          <ProFormText
            label='appSecret'
            width="md"
            name={['endpoints', 'appSecret']}
          />
        </>
      )}

      <ProFormTextArea
        name="brief"
        label={<FormattedMessage id="pages.model.create.brief" defaultMessage="brief" />}
        placeholder={intl.formatMessage({
          id: 'pages.model.create.brief.placeholder',
          defaultMessage: 'please enter brief',
        })}
        rules={[
          { max: 200, message: intl.formatMessage({ id: 'pages.model.create.brief.max', defaultMessage: 'brief max 200 char' })},
        ]}
      />

      <Button
        type="default"
        style={{ width: '100%' }}
        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      >
        {intl.formatMessage({
          id: 'pages.model.create.advancedOptions',
          defaultMessage: 'advanced options',
        })
        }
      </Button>
      {showAdvancedOptions && (
        <>
          <ProForm.Group>
            <ProFormDigit
              label={<FormattedMessage id="pages.model.create.temperature" defaultMessage="temperature" />}
              width="sm"
              name={['config', 'temperature']}
              style={{ margin: '0 16px' }}
              tooltip={intl.formatMessage({
                id: 'pages.model.create.temperature.tooltip',
                defaultMessage: 'Controls randomness. Lowering temperature means the model will take fewer risks and will be more predictable, while increasing temperature means the model will take more risks and will be less predictable.'
              })}
            />
            <ProFormDigit
              label="maxTokens"
              width="sm"
              name={['config', 'maxTokens']}
              style={{ margin: '0 16px' }}
            />
            <ProFormDigit
              label="topP"
              width="sm"
              name={['config', 'topP']}
              style={{ margin: '0 16px' }}
              tooltip={intl.formatMessage({
                id: 'pages.model.create.topP.tooltip',
                defaultMessage: 'Similar to temperature, TopP controls randomness but in a different way. Lowering TopP will narrow the model\'s token selection range, making it more likely to select the token. Increasing TopP will allow the model to choose from both high and low probability tokens. Try adjusting temperature or TopP, but not both at the same time.'
              })}
            />
          </ProForm.Group>
        </>
      )}
    </ModalForm>
  );
};

export default CreateFormModal;
