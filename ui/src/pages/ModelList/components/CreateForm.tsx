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
import { models } from '@/.umi/plugin-model/model';

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
  const [form] = Form.useForm();
  const updateProviderUrl = (newValue:string) => {
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
      title={`${!current?.id ? '新建' : '编辑'}模型`}
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
        label="名称"
        placeholder="请输入模型名称"
        rules={[
          { required: true, message: '请输入名称' },
          { max: 20, message: '名称最长20个字符' },
        ]}
      />
      <ProForm.Group>
        <ProFormSelect required width="sm" name="provider" label='服务商' valueEnum={modelService.ProviderLabel}
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
        <ProFormSelect required width="sm" name="type" label='模型' valueEnum={modelService.ModelType} />
      </ProForm.Group>

      <ProFormText
        name={['endpoints', 'url']}
        label="请求地址"
        required
        placeholder="请输入请求地址"
        rules={[
          { required: true, message: '请输入请求地址' },
        ]}
        initialValue={modelService.ProviderUrl[modelService.Provider.openai] }
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
        label="描述"
        placeholder="请输入描述"
        rules={[
          { max: 50, message: '应用描述最长50个字符' },
        ]}
      />

      <Button
        type="default"
        style={{ width: '100%' }}
        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      >
        高级选项
      </Button>
      {showAdvancedOptions && (
        <>
          <ProForm.Group>
            <ProFormDigit
              label="温度"
              width="sm"
              name={['config', 'temperature']}
              style={{ margin: '0 16px' }}
              tooltip="控制随机性。降低温度意味着模型将产生更多重复和确定性的响应。增加温度会导致更多意外或创造性的响应。尝试调整温度或 topP，但不要同时调整两者。"
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
              tooltip="与温度类似，TopP控制随机性但使用不同的方法。降低 TopP 将缩小模型的令牌选择范围，使其更有可能选择令牌。增加 TopP 将让模型从高概率和低概率的令牌中进行选择。尝试调整温度或 TopP，但不要同时调整两者。"
            />
          </ProForm.Group>
        </>
      )}
    </ModalForm>
  );
};

export default CreateFormModal;
