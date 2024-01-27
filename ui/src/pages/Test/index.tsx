import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, history } from '@umijs/max';
import { Button, Input, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import CreateFormModal from './components/CreateForm';
import { testService } from '@/services/server';

const ModelList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ServerAPI.TestListItem>();
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [warningModalLoading, setWarningModalLoading] = useState(false);
  const actionRef = useRef<ActionType>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<ServerAPI.TestListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.test.title"
          defaultMessage="title"
        />
      ),
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="pages.modelList.desc" defaultMessage="Description" />,
      dataIndex: 'brief',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.list.createdAt"
          defaultMessage="createdAt"
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
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button key='detailBtn' type="primary" onClick={() => {
          history.push(`/test/detail?id=${record.id}`)
        }}>
          <FormattedMessage id="pages.test.settingBtn" defaultMessage="Setting" />
        </Button>,
        <Button key='resultBtn' type="text" onClick={() => {
          history.push(`/test/result?id=${record.id}`)
        }}>
          <FormattedMessage id="pages.test.reportBtn" defaultMessage="Test Report" />
        </Button>,
        <Button key='editBtn' type="text" onClick={() => {
          setCurrentRow(record);
          setCreateModalOpen(true);
        }}>
          <FormattedMessage id="pages.btns.edit" defaultMessage="edit" />
        </Button>,
        <Button key='delBtn' danger type="text" onClick={() => {
          setCurrentRow(record);
          setWarningModalVisible(true);
        }}>
          <FormattedMessage id="pages.btns.del" defaultMessage="del" />
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ServerAPI.TestListItem, API.PageParams>
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
              });
              setCreateModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.modelList.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (req) => {
          const res = await testService.list(req);
          return {
            data: res.data.list,
            total: res.data.total,
            success: true,
          };
        }}
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
          actionRef.current?.reload();
        }}
      />

      <Modal
        open={warningModalVisible}
        confirmLoading={warningModalLoading}
        title="警告"
        onCancel={() => {
          setWarningModalVisible(false);
        }}
        onOk={() => {
          if (!currentRow || !currentRow.id) return;
          setWarningModalLoading(true);
          testService.del(currentRow.id).then(() => {
            setWarningModalLoading(false);
            setWarningModalVisible(false);
            actionRef.current?.reload();
          }).catch(() => {
            setWarningModalLoading(false);
            setWarningModalVisible(false);
          })
        }}
      >
        该操作将会删除该测试，是否继续？
      </Modal>
    </PageContainer>
  );
};

export default ModelList;
