import React, { useRef, useState } from 'react';
import { request } from 'umi';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ScheduleTask } from '../typing';
import EditForm, { EditFormProps } from './EditForm';

export default () => {
  const ref = useRef<ProCoreActionType>();
  const [editFormProps, setEditFormProps] = useState<EditFormProps>({
    visible: false,
    record: {} as ScheduleTask,
    onVisibleChange: (visible) => {
      setEditFormProps({ ...editFormProps, visible });
    },
    onUpdate: () => {
      ref.current?.reload();
    },
  });

  const columns: ProColumns<ScheduleTask>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '执行频率',
      dataIndex: 'cron',
    },
    {
      title: '请求方法',
      dataIndex: 'httpMethod',
    },
    {
      title: '请求地址',
      dataIndex: 'httpURL',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '操作',
      render: (_, row) => (
        <>
          <a
            key="1"
            onClick={() => {
              setEditFormProps({
                ...editFormProps,
                visible: true,
                record: row,
              });
            }}
          >
            编辑
          </a>
        </>
      ),
    },
  ];

  return (
    <div>
      <PageContainer>
        <ProTable<ScheduleTask>
          bordered
          columns={columns}
          request={(params) => request('/', { params: { ...params } })}
          rowKey="id"
          search={false}
          dateFormatter="string"
          headerTitle="任务列表"
          actionRef={ref}
          cardProps={{ bodyStyle: { paddingBottom: '25px' } }}
          toolBarRender={() => [
            <Button
              key="primary"
              type="primary"
              onClick={() =>
                setEditFormProps({
                  ...editFormProps,
                  record: {} as ScheduleTask,
                  visible: true,
                })
              }
            >
              <PlusOutlined />
              新增
            </Button>,
          ]}
          style={{ minHeight: '650px' }}
        />
        <EditForm key="edit" {...editFormProps} />
      </PageContainer>
    </div>
  );
};
