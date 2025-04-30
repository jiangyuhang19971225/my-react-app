import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Input, message } from 'antd';

interface SecondFormProps {
  onFinish?: (data: Record<string, any>) => void;
  initialValues: Record<string, any>;
}

const SecondForm = forwardRef<
  { validateFields: () => Promise<Record<string, any>> },
  SecondFormProps
>((props, ref) => {
  const [form] = Form.useForm();

  // 将表单实例暴露给父组件
  useImperativeHandle(ref, () => ({
    validateFields: () => form.validateFields(),
  }));

  return (
    <Form form={form} initialValues={props.initialValues}>
      <Form.Item
        name="field2"
        label="Field 2"
        rules={[{ required: true, message: 'Please input Field 2!' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
});

export default SecondForm;
