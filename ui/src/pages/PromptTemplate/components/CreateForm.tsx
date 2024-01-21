import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import { type FC, useState, useEffect } from 'react';

import { modelService } from '@/services/server';

type CreateFormModalProps = {
  visible: boolean;
  current?: API.ModelListItem;
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


  // 获取对话模型
  let cacheChatModelList: Array<{
    item: API.ModelListItem;
    value: string;
  }> = [];
  const getChatModelList = async () => {
    // if (cacheChatModelList.length === 0) {
    //   const res = await chatAppService.listChatModel();
    //   cacheChatModelList = res.data.list.map((item) => {
    //     return {
    //       item,
    //       value: item.id,
    //       label: (
    //         <span>
    //           {item.name}
    //           {item.brief && (
    //             <span style={{ color: 'red' }}>（{item.brief}）</span>
    //           )}
    //         </span>
    //       ),
    //     };
    //   });
    // }
    // return cacheChatModelList;
  };

  const createOrUpdateApp = async (
    values: any,
  ) => {
    if (!current?.id) {
      // await chatAppService.create(values);
    } else {
      (values as any).id = current.id;
      // await chatAppService.update(values as any);
    }
    onDone(values, current?.id);
  };
  return (
    <ModalForm<any>
      open={visible}
      title={`${!current?.id ? '新建' : '编辑'}模板`}
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
          { max: 2, message: '名称最长2个字符' },
        ]}
      />
      <ProFormSelect width="md" name="provider" label='服务商' valueEnum={modelService.ProviderLabel}
        onChange={async (value: string) => {
          if (value === modelService.Provider.yiruocloud) {
            setAuthType(modelService.AuthType.Sign);
          } else {
            setAuthType(modelService.AuthType.Authentication);
          }
        }}
      />

      <ProFormSelect width="md" name="type" label='模型' valueEnum={{
        0: '分类',
        1: '回归',
        2: '聚类',
      }} />
      {authType === modelService.AuthType.Authentication &&
        <ProFormText
          label='apikey'
          width="md"
          name="name"
        />
      }
      {authType === modelService.AuthType.Sign && (
        <>
          <ProFormText
            label='appKey'
            width="md"
            name="name"
          />
          <ProFormText
            label='appSecret'
            width="md"
            name="name"
          />
        </>
      )}

      <ProFormText
        name="description"
        label="请求地址"
        placeholder="请输入请求地址"
        rules={[
          { required: true, message: '请输入应用描述' },
        ]}
      />

      <ProFormText
        name="description"
        label="描述"
        placeholder="请输入描述"
        rules={[
          { required: true, message: '请输入应用描述' },
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
          <ProForm.Item noStyle shouldUpdate>
          <ProFormDigit
              label="温度"
              width="sm"
              required
              fieldProps={{ defaultValue: 0.7 }}
              name={['chatModelConfig', 'temperature']}
              style={{ margin: '0 16px' }}
              tooltip="控制随机性。降低温度意味着模型将产生更多重复和确定性的响应。增加温度会导致更多意外或创造性的响应。尝试调整温度或 topP，但不要同时调整两者。"
            />
            <ProFormDigit
              label="maxTokens"
              width="sm"
              name={['chatModelConfig', 'maxTokens']}
              style={{ margin: '0 16px' }}
            />
            <ProFormDigit
              label="topP"
              width="sm"
              name={['chatModelConfig', 'topP']}
              style={{ margin: '0 16px' }}
              tooltip="与温度类似，TopP控制随机性但使用不同的方法。降低 TopP 将缩小模型的令牌选择范围，使其更有可能选择令牌。增加 TopP 将让模型从高概率和低概率的令牌中进行选择。尝试调整温度或 TopP，但不要同时调整两者。"
            />
          </ProForm.Item>
        </>
      )}
    </ModalForm>
  );
};

export default CreateFormModal;
