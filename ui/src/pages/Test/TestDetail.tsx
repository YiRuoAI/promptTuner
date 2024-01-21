import { addRule, removeRule, rule, updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProCard,
  ProDescriptions,
  ProForm,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useLocation } from '@umijs/max';
import { Button, Descriptions, DescriptionsProps, Drawer, Input, Radio, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import CreateFormModal from './components/CreateForm';
import { set } from 'lodash';
import { modelService } from '@/services/server';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.ModelListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const ModelList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ServerAPI.ModelListItem>();

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const [selectedRowsState, setSelectedRows] = useState<ServerAPI.ModelListItem[]>([]);
  const location = useLocation();
  const id = location.state?.id;

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '测试标题',
      children: <p>Zhou Maomao</p>,
    },
    {
      key: '2',
      label: '测试时间',
      children: <p>1810000000</p>,
    },
  ];



  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<ServerAPI.ModelListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.test.title"
          defaultMessage="title"
        />
      ),
      dataIndex: 'title',
    },
    {
      title: <FormattedMessage id="pages.modelList.desc" defaultMessage="Description" />,
      dataIndex: 'desc',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.modelList.createdAt"
          defaultMessage="Last scheduled time"
        />
      ),
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.modelList.detail" defaultMessage="Configuration" />
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          <FormattedMessage
            id="pages.modelList.del"
            defaultMessage="Subscribe to alerts"
          />
        </a>,
      ],
    },
  ];




  return (
    <PageContainer title={false}>
      <Descriptions
        items={items}
        extra={
          <>
            <Button>测试报告</Button>
            <Button style={{ "marginLeft": "10px" }} type="primary">发起测试</Button>
          </>
        }
      />

      <ProForm
        layout="horizontal"
        onFinish={async (values) => {
          console.log(values);
          return true;
        }}
      >
        <ProFormList
          name="attributes"
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
          creatorRecord={{ name: '', items: [{ name: '' }] }}
          initialValue={[
            { name: '颜色', items: [{ name: '红' }] },
          ]}
        >
          <ProFormText
            style={{ padding: 0 }}
            width="md"
            name="name"
            label="标题"
          />
          <ProFormText
            style={{ padding: 0 }}
            width="md"
            name="name"
            label="模型"
          />

          <ProForm.Item isListField style={{ marginBlockEnd: 0 }} label="对话">
            <ProFormList
              name="items"
              creatorButtonProps={{
                creatorButtonText: '新建对话',
                icon: false,
                type: 'link',
                style: { width: 'unset' },
              }}
              min={1}
              copyIconProps={false}
              deleteIconProps={{ tooltipText: '删除' }}
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
                <ProFormRadio.Group>
                  <Radio value={1}>提示模板</Radio>
                  <Radio value={2}>自定义</Radio>
                </ProFormRadio.Group>
              </ProForm.Item>

            </ProFormList>
          </ProForm.Item>
        </ProFormList>

        <ProFormList
          name="attributes"
          label="输入值"
          creatorButtonProps={{
            creatorButtonText: '添加输入',
          }}
          min={1}
          copyIconProps={false}
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
          creatorRecord={{ name: '', items: [{ name: '' }] }}
          initialValue={[
            { name: '颜色', items: [{ name: '红' }, { name: '黄' }] },
          ]}
        >
          <ProFormText
            style={{ padding: 0 }}
            width="md"
            name="name"
            label="输入值"
          />

        </ProFormList>
      </ProForm>

      <CreateFormModal
        visible={createModalOpen}
        current={currentRow}
        onDone={(data) => {
          setCreateModalOpen(false);
          if (!data) {
            return;
          }
          // if (id) {
          //   const newList = chatAppList.map((item) => {
          //     return item.id === id ? Object.assign(item, data) : item;
          //   });
          //   setChatAppList(newList);
          // } else {
          //   pageParams.current = 1;
          //   setSelectItem(undefined);
          //   loadChatAppList();
          // }
        }}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<ServerAPI.ModelListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ModelList;
