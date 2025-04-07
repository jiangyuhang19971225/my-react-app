import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Card, message } from 'antd';
import { createStyles } from 'antd-style';
import TableComponent from './tableComponent';
import ModalComponent from './modalComponent';

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

export interface DataType {
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
export type FormItemType = {
  label: string;
  name: string;
  rules?: any[];
  element: React.ReactNode;
};

const PerInfo: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchData = useCallback(async () => {
    const response = await fetch('http://localhost:3000/persons', {
      method: 'get',
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误！状态码: ${response.status}`);
    }
    return await response.json();
  }, []);

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

  const showModal = useCallback((edit?: boolean, record?: DataType) => {
    setIsModalOpen(true);
    setIsEdit(!!edit);
    console.log('编辑新建', edit, record);

    // 新增表单重置逻辑
    if (edit && record) {
      setEditData(record);
    } else {
      console.log('执行');
      setEditData(null);
    }
  }, []);

  const addPerInfo = () => {
    showModal();
  };

  const handleDel = useCallback(
    async (id: number) => {
      const confirmDelete = window.confirm('确定删除吗？');
      if (confirmDelete) {
        try {
          const response = await fetch(`http://localhost:3000/persons/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          });
          if (response.ok) {
            console.log('删除成功');
            const newData = await fetchData();
            setDataSource(newData);
          } else {
            console.error('删除失败');
          }
        } catch (error) {
          console.error('删除失败:', error);
        }
      }
    },
    [fetchData],
  );

  const handleSubmit = async (values: DataType) => {
    try {
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
        console.error('操作失败:', errorData);
      } else {
        console.log(`${isEdit ? '修改' : '新增'}成功`);
        const newData = await fetchData();
        setDataSource(newData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('错误信息:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const { styles } = useStyle();

  const tableComponent = useMemo(
    () => (
      <TableComponent
        dataSource={dataSource}
        styles={styles}
        onEdit={showModal}
        onDelete={handleDel}
      />
    ),
    [dataSource, styles, showModal, handleDel],
  );

  return (
    <>
      <Card title="Card title" loading={loading}>
        <Button type="primary" onClick={addPerInfo}>
          新增
        </Button>

        {tableComponent}

        <ModalComponent
          isModalOpen={isModalOpen}
          isEdit={isEdit}
          editData={editData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </>
  );
};

export default PerInfo;
