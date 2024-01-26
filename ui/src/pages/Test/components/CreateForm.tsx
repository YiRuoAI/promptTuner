import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { type FC } from 'react';

import { testService } from '@/services/server';

type CreateFormModalProps = {
  visible: boolean;
  current?: ServerAPI.TestListItem;
  onDone: (
    data?: any,
    id?: string,
  ) => void;
};

const CreateFormModal: FC<CreateFormModalProps> = (props) => {
  const { visible, current, onDone } = props;

  const createOrUpdate = async (
    value: any,
  ) => {
    console.log(current)
    if (!current?.id) {
      await testService.create(value);
    } else {
      (value as any).id = current.id;
      await testService.update(value);
    }
    onDone(value, current?.id);
  };
  return (
    <ModalForm<any>
      open={visible}
      title={`${!current?.id ? '新建' : '编辑'}测试`}
      width={640}
      initialValues={current}
      onFinish={createOrUpdate}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
      }}
    >
      <ProFormText
        name="name"
        label="名称"
        placeholder="请输入测试名"
        rules={[
          { required: true, message: '请输入名称' },
          { max: 20, message: '名称最长20个字符' },
        ]}
      />

      <ProFormTextArea
        name="brief"
        label="描述"
        required
        placeholder="请输入描述"
      />
    </ModalForm>
  );
};

export default CreateFormModal;
