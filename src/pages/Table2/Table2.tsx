import React, { useState } from 'react';
import { Card, Space, Table, Button, Tag } from 'antd';
import type { TableProps } from 'antd';
import { DataType, initialData } from './data';
import EditModal from './EditModal';

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

const TableComponent = () => {
  const [data, setData] = useState<DataType[]>(initialData);
  const [formData, setFormData] = useState<DataType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const editHandle = (record: DataType) => {
    setFormData(record);
    setIsModalVisible(true);
  };

  const handleSave = (values: DataType) => {
    if (formData) {
      // 编辑记录
      setData((prevData) =>
        prevData.map((item) =>
          item.key === formData.key ? { ...item, ...values } : item,
        ),
      );
    } else {
      // 新增记录
      const newKey = (data.length + 1).toString();
      setData([...data, { ...values, key: newKey }]);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = getColumns(editHandle);

  const addHandle = () => {
    setFormData(null);
    setIsModalVisible(true);
  };

  return (
    <div>
      <Card title="查分组件后的表格" extra={<a href="#">More</a>}>
        <Button onClick={addHandle}>新增</Button>
        <Table<DataType> columns={columns} dataSource={data} />
      </Card>
      <EditModal
        visible={isModalVisible}
        onSave={handleSave}
        onCancel={handleCancel}
        formData={formData}
      />
    </div>
  );
};

export default TableComponent;
