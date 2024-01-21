import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
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
      title={`${!current?.id ? '新建' : '编辑'}测试`}
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
        placeholder="请输入测试标题"
        rules={[
          { required: true, message: '请输入标题' },
          { max: 2, message: '名称最长2个字符' },
        ]}
      />
      <ProFormTextArea
        name="name"
        label="描述"
        placeholder="请描述下您测试的内容"
        rules={[
          { required: false, message: '请输入描述' },
          { max: 200, message: '名称最长200个字符' },
        ]}
      />
    </ModalForm>
  );
};

export default CreateFormModal;
