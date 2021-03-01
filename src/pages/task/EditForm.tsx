import React, { useState, useEffect } from 'react';
import { request } from 'umi';
import moment from 'moment';
import {
  Drawer,
  Button,
  Form,
  Col,
  Row,
  Input,
  Select,
  message,
  DatePicker,
} from 'antd';
import { ScheduleTask } from '../typing';

const { TextArea } = Input;
const { Option } = Select;

export interface EditFormProps {
  record: ScheduleTask;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onUpdate: () => void;
}

const jsonValidator: {
  validator: (rule: any, value: any) => Promise<void> | void;
} = {
  validator: (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    try {
      JSON.parse(value);
    } catch (error) {
      return Promise.reject(error);
    }
    return Promise.resolve();
  },
};

export default ({
  record,
  visible,
  onVisibleChange,
  onUpdate,
}: EditFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...record,
      ...record.request,
      startTime: record.startTime ? moment(record.startTime) : null,
      endTime: record.endTime ? moment(record.endTime) : null,
      headers: record.request?.headers
        ? JSON.stringify(record.request.headers)
        : null,
      parameters: record.request?.parameters
        ? JSON.stringify(record.request.parameters)
        : null,
    });
  }, [record]);

  return (
    <Drawer
      forceRender
      title={record.id ? '编辑任务' : '新增任务'}
      width={600}
      onClose={() => {
        onVisibleChange(false);
        form.resetFields();
      }}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button
            onClick={() => onVisibleChange(false)}
            style={{ marginRight: 8 }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              form.submit();
            }}
            type="primary"
          >
            确认
          </Button>
        </div>
      }
    >
      <Form
        requiredMark={false}
        layout="vertical"
        form={form}
        onFinish={async (values) => {
          const { success, message: msg } = await request('/', {
            skipErrorHandler: true,
            method: record.id ? 'put' : 'post',
            params: {
              id: record.id,
            },
            data: {
              ...values,
              startTime: values.startTime
                ? values.startTime.format('YYYY-MM-DD HH:mm:ss')
                : undefined,
              endTime: values.endTime
                ? values.endTime.format('YYYY-MM-DD HH:mm:ss')
                : undefined,
              request: {
                ...values,
                headers: values.headers ? JSON.parse(values.headers) : null,
                parameters: values.parameters
                  ? JSON.parse(values.parameters)
                  : null,
              },
            },
          });
          if (success) {
            onUpdate();
            onVisibleChange(false);
            form.resetFields();
          } else {
            message.error(msg);
          }
        }}
        onValuesChange={(values) => {}}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="任务名称"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="cron"
              label="执行频率(CRON)"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="startTime" label="开始时间">
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="endTime" label="结束时间">
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item name="url" label="请求URL" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="method"
              label="METHOD"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item
              hasFeedback
              name="headers"
              label="请求头"
              rules={[jsonValidator]}
            >
              <TextArea rows={5} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item
              hasFeedback
              name="parameters"
              label="请求参数"
              rules={[jsonValidator]}
            >
              <TextArea rows={5} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item name="body" label="请求BODY">
              <TextArea rows={5} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
