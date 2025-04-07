import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { DataType, FormItemType } from './perinfo';

interface ModalComponentProps {
  isModalOpen: boolean;
  isEdit: boolean;
  editData: DataType | null;
  onSubmit: (values: DataType) => void;
  onCancel: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  isModalOpen,
  isEdit,
  editData,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  React.useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    } else {
      console.log('zheli1');

      form.resetFields();
    }
  }, [editData, form]);
  const formItems: FormItemType[] = [
    {
      label: '姓名',
      name: 'name',
      rules: [{ required: true, message: '必填' }],
      element: <Input />,
    },
    {
      label: '年龄',
      name: 'age',
      rules: [{ required: true }],
      element: <InputNumber />,
    },
    {
      label: '地址',
      name: 'address',
      rules: [
        { required: true },
        {
          validator(_, value) {
            if (!value) {
              return Promise.reject('必填');
            }
            return Promise.resolve();
          },
        },
      ],
      element: <Input />,
    },
    {
      label: '邮箱',
      name: 'email',
      rules: [{ required: true, type: 'email' }],
      element: <Input />,
    },
    {
      label: '手机',
      name: 'phone',
      rules: [
        { required: true, message: '请输入手机号' },
        {
          pattern: /^1[3 - 9]\d{9}$/,
          message: '请输入有效的手机号码',
        },
      ],
      element: <Input />,
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑人员' : '新增人员'}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {formItems.map((item) => (
          <Form.Item key={item.name} {...item}>
            {item.element}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default ModalComponent;
