import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';

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
  key: React.Key;
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
  rules?: any[];
  element: React.ReactNode;
};

const PerInfo: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/persons', {
      method: 'get',
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token'),
        // authorization: localStorage.getItem('token') ?? '',
        'Content-Type': 'application/json',
      },
    });
    console.log('response', response);

    if (!response.ok) {
      throw new Error(`HTTP 错误！状态码: ${response.status}`);
    }
    return await response.json();
  };
  useEffect(() => {
    const fetchAndLogData = async () => {
      try {
        const data = await fetchData(); // 添加await等待Promise解析
        setTimeout(() => {
          setDataSource(data);
          setLoading(false);
        }, 500);
      } catch (error) {
        message.error(`请求失败:${error}`);
      }
    };

    fetchAndLogData();
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
      const url = 'http://localhost:3000/persons';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(isEdit ? `${url}/${editData?.id}` : url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        message.error(errorData.message || '操作失败');
        throw new Error(errorData);
      } else {
        message.success(`${isEdit ? '修改' : '新增'}成功！`);
        // fetchData().then((data) => setDataSource(data));
        setIsModalOpen(false);
      }
      fetchData().then((data) => setDataSource(data));
      setIsModalOpen(false);
    } catch (error: unknown) {
      console.log('错误信息', JSON.stringify(error));
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
    const confirmDelete = window.confirm('确定删除吗？');
    if (confirmDelete) {
      fetch(`http://localhost:3000/persons/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
        .then((response) => {
          if (response.ok) {
            message.success('删除成功！');
            fetchData().then((data) => setDataSource(data));
          } else {
            message.error('删除失败！');
          }
        })
        .catch((error) => {
          console.error('删除失败:', error);
          message.error('删除失败！');
        });
    }
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
