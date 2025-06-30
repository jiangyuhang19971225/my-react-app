import { Layout, Card, Button, Checkbox, Form, Input, InputNumber, Steps } from 'antd';
import type { FormProps } from 'antd/lib/form';
import React, { useState, useCallback } from 'react';
import styles from './index.module.css';
import FirstForm from './components/FirstForm';
import SecondForm from './components/SecondForm';

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

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
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

          <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
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
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    first: {} as Record<string, unknown>,
    second: {} as Record<string, unknown>,
    last: {} as Record<string, unknown>,
  });

  // 创建对表单的引用
  const firstFormRef = React.useRef<{ validateFields: () => Promise<Record<string, unknown>> }>(
    null,
  );
  const secondFormRef = React.useRef<{ validateFields: () => Promise<Record<string, unknown>> }>(
    null,
  );

  const steps = [
    {
      title: 'First',
      content: <FirstForm ref={firstFormRef} initialValues={formData.first} />,
    },
    {
      title: 'Second',
      content: <SecondForm ref={secondFormRef} initialValues={formData.second} />,
    },
    {
      title: 'Last',
      content: (
        <>
          <h1>Last</h1>
          <div>
            {JSON.stringify(formData.first)}
            {JSON.stringify(formData.second)}
          </div>
        </>
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const handleFormFinish = (step: string, data: Record<string, unknown>) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: data,
    }));
    if (current < steps.length - 1) {
      setCurrent(current + 1); // 自动切换到下一个步骤
    }
  };

  const handleSubmit = () => {
    console.log('Final Data:', formData);
    // 在这里进行统一提交，例如发送到服务器
  };

  const nextStep = () => {
    // 根据当前步骤，验证对应的表单
    if (current === 0 && firstFormRef.current) {
      // 验证第一个表单
      firstFormRef.current
        .validateFields()
        .then((values) => {
          // 表单验证通过，进入下一步
          handleFormFinish('first', values);
        })
        .catch((error) => {
          console.log('Validate Failed:', error);
        });
    } else if (current === 1 && secondFormRef.current) {
      // 验证第二个表单
      secondFormRef.current
        .validateFields()
        .then((values) => {
          // 表单验证通过，进入下一步
          handleFormFinish('second', values);
        })
        .catch((error) => {
          console.log('Validate Failed:', error);
        });
    } else {
      alert('最后一步');
    }
  };

  const changeStep = (current: number) => {
    // console.log('changeStep:', current);
    setCurrent(current);
    // setTimeout(() => {
    //   nextStep();
    // });
  };

  return (
    <Card title="分部表单">
      <Steps current={current} items={items} onChange={(current) => changeStep(current)} />
      {steps[current].content}
      <div style={{ marginTop: 16 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={nextStep}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </Card>
  );
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
