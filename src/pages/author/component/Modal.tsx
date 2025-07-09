import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useParams } from 'react-router-dom';

interface FormValues {
  title: string;
  content: string;
}
interface Props {
  // Define any props if needed
  visible?: boolean;
  title?: string;
  initialValues?: FormValues;
  onCancel: () => void;
  onOk: (obj: any) => void;
}

const ModalComponent: React.FC<Props> = (props) => {
  const { visible = false, title = 'title', initialValues = { title: '', content: '' } } = props;
  const [form] = Form.useForm<FormValues>();
  const { authorId } = useParams<{ authorId: string }>();

  useEffect(() => {
    form.setFieldsValue({
      title: '',
      content: '',
    });
    // 重置表单状态
    form.resetFields();
  }, [visible, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const obj = {
        ...values,
        userId: authorId,
      };
      props.onOk(obj);
    });
  };

  const handleCancel = () => {
    props.onCancel();
  };

  return (
    <Modal
      title={title}
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {/* 确保正确传递 form 属性 */}
      <Form form={form} initialValues={initialValues}>
        <Form.Item label="Title" name="title" rules={[{ required: true, message: '必填' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Content" name="content" rules={[{ required: true, message: '必填' }]}>
          {/* 正确导入 Input.TextArea */}
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalComponent;
