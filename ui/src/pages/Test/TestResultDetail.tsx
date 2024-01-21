import { rule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, history } from '@umijs/max';
import { Button, Drawer, Input } from 'antd';
import React, { useRef, useState } from 'react';
import CreateFormModal from './components/CreateForm';
import { modelService } from '@/services/server';

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
        <a
          key="config"
          onClick={() => {
            history.push(`/test/detail?id=${record.id}`)
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
