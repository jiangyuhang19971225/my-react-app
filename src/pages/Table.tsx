import React, { useState } from 'react';
import { Card, Space, Table, Tag, Button, Modal, Form, Input } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const getColumns = (
  editHandle: (record: DataType) => void,
): TableProps<DataType>['columns'] => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => {
      console.log('jyhTags', _, tags);

      return (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      );
    },
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => {
      console.log('jyhAction', text, record);
      return (
        <Space size="middle">
          <Button type="primary" onClick={() => editHandle(record)}>
            编辑
          </Button>
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      );
    },
  },
];

const initialData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const TableComponent = () => {
  const [data, setData] = useState<DataType[]>(initialData);
  const [formData, setFormData] = useState<DataType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const editHandle = (record: DataType) => {
    console.log('jyh123', record);
    setFormData(record);
    form.setFieldsValue({
      ...record,
      tags: record?.tags ? record.tags.join(',') : '',
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Success:', values.tags);

        // 确保 tags 始终是一个数组
        const updatedValues = {
          ...values,
          tags: values.tags
            ? values.tags.split(',').map((tag: string) => tag.trim())
            : [],
        };

        if (formData) {
          // 编辑记录
          setData((prevData) =>
            prevData.map((item) =>
              item.key === formData.key ? { ...item, ...updatedValues } : item,
            ),
          );
        } else {
          // 新增记录
          const newKey = (data.length + 1).toString();
          setData([...data, { ...updatedValues, key: newKey }]);
        }
        setIsModalVisible(false);
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = getColumns(editHandle);

  const addhandle = () => {
    setFormData(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  return (
    <div>
      <Card title="Default size card" extra={<a href="#">More</a>}>
        <Button onClick={addhandle}>新增</Button>
        <Table<DataType> columns={columns} dataSource={data} />
      </Card>
      <Modal
        title={formData ? '编辑记录' : '新增记录'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
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
    </div>
  );
};

export default TableComponent;
