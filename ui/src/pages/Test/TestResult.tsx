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
          id="pages.list.createdAt"
          defaultMessage="createdAt"
        />
      ),
      hideInSearch: true,
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
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '未开始',
          status: 'Default',
        },
        1: {
          text: '处理中',
          status: 'Processing',
        },
        2: {
          text: '成功',
          status: 'Success',
        },
        3: {
          text: '失败',
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button key='detailBtn' type="primary" onClick={() => {
          history.push(`/test/result/detail?id=${record.id}`)
        }}>
          <FormattedMessage id="pages.modelList.detail1" defaultMessage="查看" />
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
          id: 'pages.resultList.title',
          defaultMessage: 'Test Report List',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        request={async (req) => {
          const res = await testService.listJob(req);
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
