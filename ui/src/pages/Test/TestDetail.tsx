import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl, useLocation, history, FormattedMessage } from '@umijs/max';
import { Button, Descriptions, DescriptionsProps, message, Form } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { modelService, promptService, testService } from '@/services/server';
import { ConversationType } from '@/services/server/test';


const ModelList: React.FC = () => {
  const [current, setCurrent] = useState<ServerAPI.TestListItem>();
  // 模型列表
  const [modelList, setModelList] = useState<ServerAPI.ModelListItem[]>([]);
  const [promptTemplateList, setPromptTemplateList] = useState<ServerAPI.PromptListItem[]>([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const formRef = useRef<any>();

  const getDetail = async (id: string) => {
    const res = await testService.detail(id);
    if (!res.data.modelConfig || res.data.modelConfig.length === 0) {
      res.data.modelConfig = [{
        name: '',
        modelId: '',
        conversationConfig: [
          // 在antd pro中，select不兼容number的，这里用字符串
          { type: ConversationType.custom + '', promptTemplateId: '', prompt: '' },
        ],
      }];
      res.data.inputConfig = [{ input: '' }];
    }
    setCurrent(res.data);

    formRef.current?.setFieldsValue(res.data);
  }
  const getModelList = async () => {
    const res = await modelService.list({ current: 1, pageSize: 9999 });
    setModelList(res.data.list);
  }
  const getPromptTemplate = async () => {
    const res = await promptService.list({ current: 1, pageSize: 9999 });
    setPromptTemplateList(res.data.list);
  }

  useEffect(() => {
    if (id) {
      getDetail(id);
      getModelList();
      getPromptTemplate();
    }
  }, [id]);


  const items: DescriptionsProps['items'] = [
    {
      key: 'name',
      label: '标题',
      children: <p>{current?.name}</p>,
    },
    {
      key: 'createdAt',
      label: '创建时间',
      children: <p>{current?.createdAt}</p>,
    },
  ];



  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  return (
    <PageContainer title={false}>
      <Descriptions
        items={items}
        extra={
          <>
            <Button onClick={() => {
              if (!current?.id) {
                message.error('找不到测试');
                return;
              }
              history.push(`/test/result?id=${current?.id}`)
            }}>
              <FormattedMessage id="pages.test.reportBtn" defaultMessage="Test Report" />
            </Button>
            <Button
              style={{ "marginLeft": "10px" }}
              type="primary"
              onClick={async () => {
                if (!current?.id) {
                  message.error('请先保存测试');
                  return;
                }
                const res = await testService.startJob(current.id);
                console.log(res);
              }}
            >
              发起测试
            </Button>
          </>
        }
      />

      <ProForm
        layout="horizontal"
        formRef={formRef}
        form={form}
        onValuesChange={(changedValues, allValues) => {
          // changedValues.modelConfig长度是多少，那么inputConfig就要有多少个
          const inputConfig = allValues.inputConfig;
          const modelConfig = allValues.modelConfig;
          if (inputConfig.length < modelConfig.length) {
            const addCount = modelConfig.length - inputConfig.length;
            for (let i = 0; i < addCount; i++) {
              inputConfig.push({ input: '' });
            }
            form.setFieldsValue({ inputConfig });
          }
          if (inputConfig.length > modelConfig.length) {
            const delCount = inputConfig.length - modelConfig.length;
            for (let i = 0; i < delCount; i++) {
              inputConfig.pop();
            }
            form.setFieldsValue({ inputConfig });
          }
        }}
        onFinish={async (values) => {
          if (!current?.id) {
            return false;
          }
          // 将conversationType转为number
          values.modelConfig.forEach((item: any) => {
            item.conversationConfig.forEach((conversation: any) => {
              conversation.type = Number(conversation.type);
            });
          });
          const res = await testService.update({ ...values, id: current?.id })
          if (res.code === 0) {
            message.success('保存成功');
          }
          return true;
        }}
      >
        <ProFormList
          name="modelConfig"
          label="测试模型"
          creatorButtonProps={{
            creatorButtonText: '添加测试模型',
          }}
          min={1}
          copyIconProps={false}
          itemRender={({ listDom, action }, { index }) => (
            <ProCard
              bordered
              style={{ marginBlockEnd: 8 }}
              title={`模型${index + 1}`}
              extra={action}
              bodyStyle={{ paddingBlockEnd: 0 }}
            >
              {listDom}
            </ProCard>
          )}
        >
          <ProFormText
            style={{ padding: 0 }}
            width="md"
            required
            name="name"
            label="标题"
          />

          <ProFormSelect
            name="modelId"
            required
            label="模型"
            options={modelList.map((item) => ({ label: item.name, value: item.id }))}

          />


          <ProForm.Item isListField style={{ marginBlockEnd: 0 }} label="对话">
            <ProFormList
              name="conversationConfig"
              creatorButtonProps={{
                creatorButtonText: '新建对话',
                icon: false,
                type: 'link',
                style: { width: 'unset' },
              }}
              min={1}
              copyIconProps={false}
              deleteIconProps={{ tooltipText: '删除' }}
              creatorRecord={{ type: '1', templateId: '', prompt: '' }}
              itemRender={({ listDom, action }, { index }) => (
                <ProCard
                  bordered
                  style={{ marginBlockEnd: 8 }}
                  title={`对话${index + 1}`}
                  extra={action}
                  bodyStyle={{ paddingBlockEnd: 0 }}
                >
                  {listDom}
                </ProCard>
              )}
            >
              <ProForm.Item>
                <ProFormRadio.Group name="type" label="类型" required

                  options={[
                    {
                      label: '提示模板',
                      value: '0',
                    },
                    {
                      label: '自定义',
                      value: '1',
                    },
                  ]}
                >
                </ProFormRadio.Group>
              </ProForm.Item>
              <ProFormDependency name={['type']} shouldUpdate>
                {({ type }) => {
                  if (type === '0') {
                    return (
                      <ProFormSelect
                        name="promptTemplateId"
                        required
                        label="模板"
                        options={promptTemplateList.map((item) => ({ label: item.name, value: item.id }))}
                      />
                    );
                  }
                  if (type === '1') {
                    return (
                      <ProFormTextArea name="prompt" label="提示" />
                    );
                  }
                  return null;
                }}
              </ProFormDependency>

            </ProFormList>
          </ProForm.Item>
        </ProFormList>

        <ProFormList
          name="inputConfig"
          label="输入值"
          min={1}
          creatorButtonProps={false}
          copyIconProps={false}
          deleteIconProps={false}
          itemRender={({ listDom, action }, { index }) => (
            <ProCard
              bordered
              style={{ marginBlockEnd: 8 }}
              title={`输入${index + 1}`}
              extra={action}
              bodyStyle={{ paddingBlockEnd: 0 }}
            >
              {listDom}
            </ProCard>
          )}
        >
          <ProFormText
            style={{ padding: 0 }}
            width="md"
            name="input"
            label="输入值"
          />

        </ProFormList>
      </ProForm>

    </PageContainer>
  );
};

export default ModelList;
