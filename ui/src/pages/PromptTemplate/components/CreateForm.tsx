import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { type FC } from 'react';

import { promptService } from '@/services/server';

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

  const createOrUpdateApp = async (
    value: any,
  ) => {
    if (!current?.id) {
      await promptService.create(value);
    } else {
      (value as any).id = current.id;
      await promptService.update(value);
    }
    onDone(value, current?.id);
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
        placeholder="请输入模板名"
        rules={[
          { required: true, message: '请输入名称' },
          { max: 20, message: '名称最长20个字符' },
        ]}
      />

      <ProFormTextArea
        name="prompt"
        label="模板"
        required
        placeholder="请输入模板"
      />
    </ModalForm>
  );
};

export default CreateFormModal;
