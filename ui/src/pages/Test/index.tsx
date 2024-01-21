import { addRule, removeRule, rule, updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, history } from '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';
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
        <Button key='detailBtn' type="primary" onClick={() => {
          history.push(`/test/detail?id=${record.id}`)
        }}>
          <FormattedMessage id="pages.modelList.detail1" defaultMessage="配置" />
        </Button>,
        <Button key='resultBtn' type="text" onClick={() => {
          history.push(`/test/detail?id=${record.id}`)
        }}>
          <FormattedMessage id="pages.modelList.detail1" defaultMessage="测试报告" />
        </Button>,
        <Button key='resultBtn' type="text" onClick={() => {
          history.push(`/test/detail?id=${record.id}`)
        }}>
          <FormattedMessage id="pages.modelList.detail1" defaultMessage="编辑" />
        </Button>,
        <Button danger key='delBtn' type="text">
          <FormattedMessage
            id="pages.modelList.del"
            defaultMessage="Subscribe to alerts"
          />
        </Button>,
        <a style={{ color: 'error-color' }} key="subscribeAlert" href="https://procomponents.ant.design/">

        </a>,
      ],
    },
  ];




  return (
    <PageContainer>
      <ProTable<ServerAPI.ModelListItem, API.PageParams>
        rowSelection={false}
        headerTitle={intl.formatMessage({
          id: 'pages.test.title',
          defaultMessage: 'test',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow({
                name: '',
                provider: modelService.Provider.openai
              });
              setCreateModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.modelList.new" defaultMessage="New" />
          </Button>,
        ]}
        request={rule}
        columns={columns}
      />

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
