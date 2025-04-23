import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
import { getPersons, addPerson, updatePerson, deletePerson } from '../../services/api';

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table {
        .ant-table-container {
          .ant-table-body,
          .ant-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

interface DataType {
  key?: React.Key;
  id: number;
  name: string;
  age: number;
  address: string;
  email: string;
  phone: string;
}
// 表单提交处理
// 在顶部添加类型定义
type FormItemType = {
  label: string;
  name: string;
  rules?: Record<string, unknown>[];
  element: React.ReactNode;
};

const PerInfo: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (): Promise<DataType[]> => {
    try {
      // 响应拦截器已经提取了响应中的data部分
      return (await getPersons()) as unknown as DataType[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      message.error(`请求失败: ${errorMessage}`);
      return [];
    }
  };

  useEffect(() => {
    const fetchAndLoadData = async () => {
      try {
        const data = await fetchData();
        setTimeout(() => {
          setDataSource(data);
          setLoading(false);
        }, 500);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        message.error(`请求失败: ${errorMessage}`);
      }
    };

    fetchAndLoadData();
  }, []);

  const { styles } = useStyle();
  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      fixed: 'left',
      key: 'id', // 需要补全 key
    },
    {
      title: 'Age',
      width: 100,
      dataIndex: 'age',
      key: 'age', // 需要补全 key
    },
    {
      title: '地址',
      width: 150,
      dataIndex: 'address',
      key: 'address', // 需要补全 key
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'phone', // （如：'user.address.city'） 从数据源 dataSource 中提取对应的值
      width: 150,
    },
    {
      title: '操作',
      key: 'operation', // ✅ 已正确设置唯一 key
      fixed: 'right',
      width: 100,
      render: (value, record) => {
        return (
          <>
            <div>
              <a onClick={() => handleEdit(record.id)}>编辑</a>
              <Button type="link" danger onClick={() => handleDel(record.id)}>
                删除
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  // 新增状态管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [form] = Form.useForm();

  const showModal = (edit?: boolean, record?: DataType) => {
    setIsModalOpen(true);
    setIsEdit(!!edit);

    // 重置表单状态
    form.resetFields();

    if (edit && record) {
      form.setFieldsValue(record);
      setEditData(record);
    } else {
      // 清空初始值
      form.setFieldsValue({
        id: undefined,
        name: '',
        age: undefined,
        address: '',
        email: '',
        phone: '',
      });
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // 修改表单项结构定义
  const formItems: FormItemType[] = [
    {
      label: '姓名',
      name: 'name',
      rules: [{ required: true, message: '必填' }],
      element: <Input />,
    },
    { label: '年龄', name: 'age', rules: [{ required: true }], element: <InputNumber /> },
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
            // if (!/^1[3-9]\d{9}$/.test(value)) {
            //   return Promise.reject('请输入有效的11位手机号码');
            // }
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
          pattern: /^1[3-9]\d{9}$/,
          message: '请输入有效的手机号码',
        },
      ],
      element: <Input />,
    },
  ];

  // 修改提交处理函数
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEdit && editData) {
        await updatePerson(editData.id, values);
        message.success('修改成功！');
      } else {
        await addPerson(values);
        message.success('新增成功！');
      }

      const data = await fetchData();
      setDataSource(data);
      setIsModalOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('错误信息', error);
      message.error(`操作失败: ${errorMessage}`);
    }
  };

  // 修改原有方法
  const handleEdit = (id: number) => {
    const record = dataSource.find((item) => item.id === id);
    if (record) showModal(true, record);
  };

  const addPerInfo = () => {
    showModal();
  };

  const handleDel = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePerson(id);
          message.success('删除成功');
          const data = await fetchData();
          setDataSource(data);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          message.error(`删除失败: ${errorMessage}`);
        }
      },
    });
  };

  return (
    <>
      <Card title="Card title" loading={loading}>
        <Button type="primary" onClick={addPerInfo}>
          新增
        </Button>
        <Table<DataType>
          rowKey="id"
          className={styles.customTable}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 'max-content', y: 55 * 5 }}
        />
      </Card>

      {/* 新增弹窗组件 */}
      <Modal
        title={isEdit ? '编辑人员' : '新增人员'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={editData || {}}>
          {formItems.map((item) => (
            <Form.Item key={item.name} {...item}>
              {item.element}
            </Form.Item>
          ))}
          {/* {formItems.map((item) => (
            <Form.Item
              key={item.name}
              label={item.label}
              name={item.name}
              rules={item.rules}
              validateTrigger="onBlur"
            >
              {item.element}
            </Form.Item>
          ))} */}
        </Form>
      </Modal>
    </>
  );
};

export default PerInfo;
