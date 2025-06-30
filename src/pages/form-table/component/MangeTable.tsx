import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Card } from 'antd';
import type { TableColumnsType } from 'antd';

interface UserType {
  name: string;
  age: number;
  position: string;
}
const tableColumns: TableColumnsType<UserType> = [
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
    title: '职位',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '操作',
    key: 'action',
    render: (_: unknown, record: UserType) => (
      <>
        <Button type="link" onClick={() => handleEdit(record)}>
          编辑
        </Button>
        <Button type="link">删除</Button>
      </>
    ),
  },
];
const handleEdit = (record: UserType) => {
  console.log('编辑', record);
};

const UserTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<UserType[]>([]);
  useEffect(() => {
    setDataSource([{ name: '张三', age: 20, position: '开发' }]);
  }, []);
  return (
    <>
      <Table columns={tableColumns} dataSource={dataSource}></Table>
    </>
  );
};

const MangeTable: React.FC = () => {
  return (
    <Card title={'员工信息管理'}>
      <UserTable></UserTable>
    </Card>
  );
};

export default MangeTable;
