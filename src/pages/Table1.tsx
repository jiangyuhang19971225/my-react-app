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
    render: (_, { tags }) => (
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
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button type="primary" onClick={() => editHandle(record)}>
          编辑
        </Button>
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
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
  const [formData, setFormData] = useState<DataType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const editHandle = (record: DataType) => {
    setFormData(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log('Updated values:', formData);
    setIsModalVisible(false);
    // 更新数据逻辑
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const columns = getColumns(editHandle);

  return (
    <div>
      <Card title="Default size card" extra={<a href="#">More</a>}>
        <Table<DataType> columns={columns} dataSource={data} />
      </Card>
      <Modal
        title="编辑记录"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {formData && (
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="Age">
              <Input name="age" value={formData.age} onChange={handleChange} />
            </Form.Item>
            <Form.Item label="Address">
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="Tags">
              <Input
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleChange}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default TableComponent;
