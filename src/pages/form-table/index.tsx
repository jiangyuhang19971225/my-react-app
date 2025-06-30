import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker, Table, Card } from 'antd';
import axios from 'axios';
import { get, defaultTo } from 'lodash-es';
import UserFormModal, { type UserFormValues } from './component/UserFormModal';
import MangeTable from './component/MangeTable';

// UserFormValues类型定义已在UserFormModal组件中定义，这里不重复定义

type LayoutType = Parameters<typeof Form>[0]['layout'];
interface UserFormData {
  name?: string;
  phone?: string;
  datetime?: [];
}
const UserForm = () => {
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm<UserFormData>();
  const [formLayout] = useState<LayoutType>('inline');

  const formRule = {
    name: [
      { required: true, message: '请输入姓名!' },
      { min: 2, max: 10, message: '姓名长度在2到10个字符之间' },
    ],
    phone: [
      { required: true, message: '请输入手机号!' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
    ],
    datetime: [{ required: true, message: '请选择时间日期!' }],
  };

  const onSubmit = async () => {
    try {
      // 校验表单
      form.validateFields();
      // const values = form.getFieldsValue();
      const values = await form.validateFields();
      console.log('表单数据', values);
    } catch (error) {
      console.error('获取表单数据失败', error);
    }
  };
  return (
    <Form layout={formLayout} form={form} initialValues={{ layout: formLayout }}>
      <Form.Item label="姓名" name="name" rules={formRule.name}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="手机号" name="phone" rules={formRule.phone}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="时间日期" name="datetime" rules={formRule.datetime}>
        <RangePicker showTime />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

interface listData {
  key: number;
  name: string;
  age: number;
  address: string;
  email: string;
  phone: string;
  job: string;
  company: string;
  salary: number;
}
interface UserTableProps {
  onEdit: (record: listData) => void;
  onDelete: (record: listData) => void;
}

const UserTable: React.FC<UserTableProps> = ({ onEdit, onDelete }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<listData[]>([]);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '职位',
      dataIndex: 'job',
      key: 'job',
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      key: 'salary',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: listData) => (
        <span>
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => onDelete(record)}>
            删除
          </Button>
        </span>
      ),
    },
  ];
  // useEffect 期望的回调函数返回值要么是 void，要么是一个清理函数（Destructor）
  // useEffect 的回调函数要求是同步函数，不能直接是 async 异步函数，
  useEffect(() => {
    // const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/tableData');
        // 使用 get 获取 response.data.data 的值，若值不存在则使用 defaultTo 设置默认值为空数组
        // get取不到值为undefined defaultTo null undefined 会返回默认值
        const tableData = defaultTo(get(response, 'data.data'), []);
        setDataSource(tableData);
      } catch (error) {
        console.log(error);
        // if (error instanceof Error && error.name !== 'AbortError') {
        //   console.error('获取表格数据失败', error);
        // }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 清理函数：组件卸载时取消请求
    return () => {
      // abortController.abort();
    };
  }, []);

  return <Table dataSource={dataSource} columns={columns} loading={loading} />;
};

//   2. 实际执行过程
// {FormComponent()}：
// 直接执行函数
// 返回JSX结果
// 没有独立的组件实例
// 没有自己的生命周期
// <FormComponent />：
// React创建组件实例
// 管理组件生命周期
// 有独立的状态和副作用
// React DevTools可以识别
const FormTable: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<UserFormValues>({});

  const handleEdit = (record: listData) => {
    setVisible(true);
    setInitialValues(record);
  };

  const handleDelete = (record: listData) => {
    console.log('删除用户:', record);
    // 这里可以添加删除逻辑
  };

  const handleClose = () => {
    setVisible(false);
    setInitialValues({});
  };

  const handleSubmit = (values: UserFormValues) => {
    console.log('提交数据:', values);
    // 这里可以添加提交逻辑
    setVisible(false);
  };

  const addForm = () => {
    setVisible(true);
    setInitialValues({});
  };
  return (
    <div>
      <UserForm />
      <Button onClick={addForm}>新建</Button>
      <UserTable onEdit={handleEdit} onDelete={handleDelete} />
      <UserFormModal
        visible={visible}
        onClose={handleClose}
        submit={handleSubmit}
        initialValues={initialValues}
      />
      <Card>
        <MangeTable></MangeTable>
      </Card>
    </div>
  );
};

export default FormTable;
