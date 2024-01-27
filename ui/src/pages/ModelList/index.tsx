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
import { modelService } from '@/services/server';

const ModelList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ServerAPI.ModelListItem>();
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [warningModalLoading, setWarningModalLoading] = useState(false);
  const actionRef = useRef<ActionType>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<ServerAPI.ModelListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.modelList.name"
          defaultMessage="name"
        />
      ),
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="pages.modelList.provider" defaultMessage="Provider" />,
      dataIndex: 'provider',
    },
    {
      title: <FormattedMessage id="pages.modelList.type" defaultMessage="Type" />,
      dataIndex: 'type',
      valueType: 'textarea',
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
      <ProTable<ServerAPI.ModelListItem, API.PageParams>
        rowSelection={false}
        headerTitle={intl.formatMessage({
          id: 'pages.modelList.title',
          defaultMessage: 'model pool',
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
        request={async (req) => {
          const res = await modelService.list(req);
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
          modelService.del(currentRow.id).then(() => {
            setWarningModalLoading(false);
            setWarningModalVisible(false);
            actionRef.current?.reload();
          }).catch(() => {
            setWarningModalLoading(false);
            setWarningModalVisible(false);
          })
        }}
      >
        {intl.formatMessage({
          id: 'pages.modelList.delWarning',
          defaultMessage: 'Are you sure you want to delete {name}?',
        }, {
          name: currentRow?.name
        })
        }
      </Modal>
    </PageContainer>
  );
};

export default ModelList;
