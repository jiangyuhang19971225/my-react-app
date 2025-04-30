// FirstForm.tsx
import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Input } from 'antd';

interface FirstFormProps {
  onFinish?: (data: Record<string, any>) => void;
  initialValues: Record<string, any>;
}

const FirstForm = forwardRef<
  { validateFields: () => Promise<Record<string, any>> },
  FirstFormProps
>((props, ref) => {
  // const { onFinish } = props;
  const [form] = Form.useForm();

  // 将表单实例暴露给父组件
  useImperativeHandle(ref, () => ({
    validateFields: () => form.validateFields(),
  }));

  // const handleFinish = (values: Record<string, any>) => {
  //   console.log('handleFinish:', values);
  //   onFinish(values); // 调用父组件的 onFinish
  //   // form.resetFields(); // 可选：重置表单
  // };

  return (
    <Form form={form} initialValues={props.initialValues}>
      <Form.Item
        name="field1"
        label="Field 1"
        rules={[{ required: true, message: 'Please input Field 1!' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
});

export default FirstForm;
