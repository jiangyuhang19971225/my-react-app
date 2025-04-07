import { Layout, Card, Button, Checkbox, Form, Input, InputNumber } from 'antd';
import type { FormProps } from 'antd/lib/form';
import React from 'react';
import styles from './index.module.css';

type FieldType = {
  username?: string;
  password?: string;
  age?: number;
  remember?: boolean; // 修正为 boolean 类型
};

const BasicForm: React.FC = () => {
  const { Content } = Layout;
  const [baseform, setBaseform] = React.useState<FieldType>({});
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    setBaseform(values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Content style={{ padding: '20px' }}>
      <Card title="基础表单和验证表单">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true, age: 18 }} // 添加 age 初始值
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Age"
            name="age"
            rules={[{ required: true, message: 'Please input your age!' }]}
          >
            <InputNumber min={0} max={150} /> {/* 添加范围限制 */}
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            label={null}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

        {baseform && (
          <div>
            {baseform.age} {baseform.password} {baseform.username}{' '}
          </div>
        )}
      </Card>
    </Content>
  );
};

const Form1: React.FC = () => {
  return <Card title="form1"></Card>;
};

export default function FormDemo() {
  return (
    <>
      <div className={styles.title}>表单</div>
      <BasicForm />
      <Form1 />
    </>
  );
}
