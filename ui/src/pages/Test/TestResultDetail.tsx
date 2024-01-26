import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl, useLocation } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import { testService } from '@/services/server';

const ModelList: React.FC = () => {
  const [current, setCurrent] = useState<any>();
  const [columns, setColumns] = useState<ProColumns<any>[]>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  const actionRef = useRef<ActionType>();


  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const getResult = async () => {
    if (!id) {
      return;
    }
    const res = await testService.getTestJobDetail({ testJobId: id });
    let tmpColumns: ProColumns<any>[] = [
      {
        title: '输入值',
        dataIndex: 'input',
      },
    ];
    // 遍历res.list，将其设置刀columns中
    let testResult: any[] = [];
    const inputConfig = res.data.job.inputConfig ?? [];
    res.data.list.forEach((item, index) => {
      tmpColumns.push({
        title: item.modelSnapshot?.name,
        dataIndex: item.id,
        render: (_, record) => {
          // 数组是用foreach还是each?
          const data: any[] = record[item.id] ?? [];
          let index = 0;
          return data.map((item: any) => {
            return <div key={index++}>{item.role}:{item.content}</div>
          })
        }
      });
      testResult.push({
        input: inputConfig[index].input,
        [item.id]: item.messages,
      })
    });
    setColumns(tmpColumns)
    setCurrent(testResult)
  }

  useEffect(() => {
    getResult();
  }, []);


  return (
    <PageContainer>
      <ProTable<any, any>
        rowSelection={false}
        headerTitle="测试报告"
        actionRef={actionRef}
        rowKey="key"
        search={false}
        columns={columns}
        dataSource={current}
        pagination={false}
      />
    </PageContainer>
  );
};

export default ModelList;
