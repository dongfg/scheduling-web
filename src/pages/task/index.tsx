import React, { useRef, useState } from 'react';
import { request } from 'umi';
import {
  ProCoreActionType,
  PageContainer,
  ProTable,
  ProColumns,
  TableDropdown,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Button, Modal, Divider, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ScheduleTask } from '../typing';
import EditForm, { EditFormProps } from './EditForm';

const requestRowRender = (record: ScheduleTask) => {
  return (
    <>
      <ProDescriptions column={3}>
        <ProDescriptions.Item label="请求方法">
          {record.request.method}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="请求地址">
          {record.request.url}
        </ProDescriptions.Item>
        {record.request.parameters && (
          <ProDescriptions.Item label="请求参数">
            {JSON.stringify(record.request.parameters)}
          </ProDescriptions.Item>
        )}
        {record.request.headers && (
          <ProDescriptions.Item label="请求头">
            {JSON.stringify(record.request.headers)}
          </ProDescriptions.Item>
        )}
        {record.request.body && (
          <ProDescriptions.Item label="提交内容">
            {record.request.body}
          </ProDescriptions.Item>
        )}
      </ProDescriptions>
    </>
  );
};

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

  const moreOperate = (row: ScheduleTask) => (
    <TableDropdown
      key="actionGroup"
      onSelect={async (key) => {
        if (key === 'delete') {
          Modal.confirm({
            title: '确定删除任务吗?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后不可恢复',
            onOk: async () => {
              try {
                const res = await request('/', {
                  skipErrorHandler: true,
                  method: 'delete',
                  params: {
                    id: row.id,
                  },
                });
                if (res.success) {
                  ref.current?.reload();
                } else {
                  message.error(res.errorMessage);
                }
              } catch (error) {
                message.error(
                  error instanceof Error ? error.message : String(error),
                );
              }
            },
            onCancel() {},
          });
        } else if (key === 'trigger') {
          try {
            const res = await request('/trigger', {
              skipErrorHandler: true,
              method: 'get',
              params: {
                id: row.id,
              },
            });
            if (res.success) {
              ref.current?.reload();
            } else {
              message.error(res.errorMessage);
            }
          } catch (error) {
            message.error(
              error instanceof Error ? error.message : String(error),
            );
          }
        }
      }}
      menus={[
        { key: 'trigger', name: '执行' },
        { key: 'delete', name: '删除' },
      ]}
    />
  );

  const columns: ProColumns<ScheduleTask>[] = [
    {
      title: '分组',
      dataIndex: 'group',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      hideInSearch: true,
      title: '状态',
      dataIndex: 'status',
    },
    {
      hideInSearch: true,
      title: '执行频率',
      dataIndex: 'cron',
    },
    {
      hideInSearch: true,
      title: '请求方法',
      dataIndex: 'httpMethod',
    },
    {
      hideInSearch: true,
      title: '请求地址',
      dataIndex: 'httpURL',
    },
    {
      hideInSearch: true,
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      hideInSearch: true,
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      hideInSearch: true,
      title: '操作',
      render: (_, row) => (
        <>
          {(row.status === 'RUNNING' || row.status === 'PAUSE') && (
            <>
              <a
                key="1"
                onClick={async () => {
                  try {
                    const res = await request(
                      row.status === 'RUNNING' ? '/pause' : '/resume',
                      {
                        skipErrorHandler: true,
                        method: 'put',
                        params: {
                          id: row.id,
                        },
                      },
                    );
                    if (res.success) {
                      ref.current?.reload();
                    } else {
                      message.error(res.errorMessage);
                    }
                  } catch (error) {
                    message.error(
                      error instanceof Error ? error.message : String(error),
                    );
                  }
                }}
              >
                {row.status === 'RUNNING' ? '暂停' : '恢复'}
              </a>
              <Divider type="vertical" />
            </>
          )}
          <a
            key="2"
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
          <Divider type="vertical" />
          {moreOperate(row)}
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
          search={{
            filterType: 'light',
          }}
          dateFormatter="string"
          headerTitle="任务列表"
          actionRef={ref}
          cardProps={{ bodyStyle: { paddingBottom: '25px' } }}
          expandable={{
            expandedRowRender: requestRowRender,
          }}
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
