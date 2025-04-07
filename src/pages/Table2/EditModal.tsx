import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { DataType } from './data.ts';

interface EditModalProps {
  visible: boolean;
  onSave: (values: DataType) => void;
  onCancel: () => void;
  formData: DataType | null;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onSave,
  onCancel,
  formData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formData) {
      form.setFieldsValue({
        ...formData,
        tags: formData.tags.join(','),
      });
    } else {
      form.resetFields();
    }
  }, [formData, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedValues = {
          ...values,
          tags: values.tags
            ? values.tags.split(',').map((tag: string) => tag.trim())
            : [],
        };
        onSave(updatedValues);
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title={formData ? '编辑记录' : '新增记录'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="horizontal">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: 'Please input the age!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please input the address!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
