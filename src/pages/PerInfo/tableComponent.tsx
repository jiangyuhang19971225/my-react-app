import React from 'react';
import { Table, Button } from 'antd';
import type { TableColumnsType } from 'antd';
import { DataType } from './perinfo';

interface TableComponentProps {
  dataSource: DataType[];
  styles: any;
  onEdit: (edit: boolean, record: DataType) => void;
  onDelete: (id: number) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  dataSource,
  styles,
  onEdit,
  onDelete,
}) => {
  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      fixed: 'left',
      key: 'id',
    },
    {
      title: 'Age',
      width: 100,
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      width: 150,
      dataIndex: 'address',
      key: 'address',
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
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      render: (created_at) => (created_at ? new Date(created_at).toLocaleString() : '-'),
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 150,
      render: (value, record) => {
        return (
          <>
            <div>
              <a onClick={() => onEdit(true, record)}>编辑</a>
              <Button type="link" danger onClick={() => onDelete(record.id)}>
                删除
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <Table<DataType>
      rowKey="id"
      className={styles.customTable}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 'max-content', y: 40 * 10 }}
    />
  );
};

export default TableComponent;
