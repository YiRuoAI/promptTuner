import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import CreateFormModal from './components/CreateForm';
import { promptService } from '@/services/server';


const ModelList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ServerAPI.PromptListItem>();
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [warningModalLoading, setWarningModalLoading] = useState(false);
  const actionRef = useRef<ActionType>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<ServerAPI.PromptListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.promptList.name"
          defaultMessage="name"
        />
      ),
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="pages.promptList.prompt" defaultMessage="prompt" />,
      dataIndex: 'prompt',
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.list.createdAt"
          defaultMessage="createdAt"
        />
      ),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
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
      <ProTable<ServerAPI.PromptListItem, API.PageParams>
        rowSelection={false}
        headerTitle={intl.formatMessage({
          id: 'pages.promptList.title',
          defaultMessage: 'prompt template',
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
              setCurrentRow({});
              setCreateModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.modelList.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (req) => {
          const res = await promptService.list(req);
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
          promptService.del(currentRow.id).then(() => {
            setWarningModalLoading(false);
            setWarningModalVisible(false);
            actionRef.current?.reload();
          }).catch(() => {
            setWarningModalLoading(false);
            setWarningModalVisible(false);
          })
        }}
      >
        该操作将会删除该模型，是否继续？
      </Modal>
    </PageContainer>
  );
};

export default ModelList;
