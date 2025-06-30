import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

export interface UserFormValues {
  key?: number;
  name?: string;
  age?: number;
  address?: string;
  email?: string;
  phone?: string;
  job?: string;
  company?: string;
  salary?: number;
}

interface UserFormModalProps {
  visible: boolean;
  onClose: () => void;
  submit: (values: UserFormValues) => void;
  initialValues: UserFormValues;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  onClose,
  submit,
  initialValues,
}) => {
  const [form] = Form.useForm<UserFormValues>();
  const handleOk = async () => {
    try {
      const value = await form.validateFields();
      submit(value);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (visible) {
      if (Object.keys(initialValues).length === 0) {
        // 新建时清空表单
        form.resetFields();
      } else {
        // 编辑时设置初始值
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form]);

  return (
    <div>
      <Modal
        open={visible}
        title={Object.keys(initialValues).length > 0 ? '编辑用户' : '新建用户'}
        onCancel={onClose}
        footer={null}
      >
        <Form form={form} layout="vertical" initialValues={initialValues}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Age" name="age">
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Job" name="job">
            <Input />
          </Form.Item>
          <Form.Item label="Company" name="company">
            <Input />
          </Form.Item>
          <Form.Item label="Salary" name="salary">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => handleOk()}>
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserFormModal;
