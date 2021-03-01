import React, { useRef, useState } from 'react';
import { request } from 'umi';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, TableDropdown } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { Button, Modal, Divider, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ScheduleTaskLog } from '../typing';

const requestRowRender = (record: ScheduleTaskLog) => {
  return <>TODO</>;
};

export default () => {
  const ref = useRef<ProCoreActionType>();

  const columns: ProColumns<ScheduleTaskLog>[] = [
    {
      title: '任务',
      dataIndex: 'taskId',
      valueType: 'select',
      request: async () => {
        const res = await request('/', {
          skipErrorHandler: true,
          method: 'get',
          params: {
            pageSize: -1,
          },
        });
        if (res.success) {
          return res.data.map((t: any) => {
            return {
              label: t.name,
              value: t.id,
            };
          });
        }
        return [];
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '耗时',
      render: (_, row) => row.timeCost + 'ms',
      search: false,
    },
    {
      title: '响应结果',
      render: (_, row) =>
        row.errorMessage ? row.errorMessage : row.responseStatus,
      search: false,
    },
    {
      title: '响应内容',
      dataIndex: 'responseBody',
      search: false,
      ellipsis: true,
    },
    {
      title: '请求时间',
      dataIndex: 'createTime',
      search: false,
    },
  ];

  return (
    <div>
      <PageContainer>
        <ProTable<ScheduleTaskLog>
          bordered
          columns={columns}
          request={(params) => request('/log', { params: { ...params } })}
          rowKey="id"
          dateFormatter="string"
          headerTitle="任务日志列表"
          actionRef={ref}
          cardProps={{ bodyStyle: { paddingBottom: '25px' } }}
          style={{ minHeight: '650px' }}
        />
      </PageContainer>
    </div>
  );
};
