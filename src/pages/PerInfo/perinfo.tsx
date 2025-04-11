import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { Button, Card, Input, message, Form, Row, Col, Space } from 'antd';
import { createStyles } from 'antd-style';
import TableComponent from './tableComponent';
import ModalComponent from './modalComponent';
import { ApiConfigContext } from '../../App';

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

interface SearchFormValues {
  name?: string;
  age?: number;
}

const PerInfo: React.FC = () => {
  // 获取API配置
  const apiConfig = useContext(ApiConfigContext);

  console.log('蒋宇航23', apiConfig);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

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
      console.log('编辑', record);
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
        const { error } = await response.json();
        message.error(`操作失败:', ${error}`);
        console.error('操作失败:', error);
      } else {
        console.log(`${isEdit ? '修改' : '新增'}成功`);
        message.success(`${isEdit ? '修改' : '新增'}成功`);
        const newData = await fetchData();
        setDataSource(newData);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('错误信息:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async (values: SearchFormValues) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (values.name) queryParams.append('name', values.name);
      if (values.age) queryParams.append('age', values.age.toString());

      const response = await fetch(
        `http://localhost:3000/search/persons?${queryParams.toString()}`,
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDataSource(data);
      message.success('查询成功');
    } catch (error) {
      message.error('查询失败: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    fetchData().then((data) => {
      setDataSource(data);
      message.success('已重置');
    });
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
      <Card title="人员信息管理" loading={loading}>
        <Form form={form} onFinish={handleSearch} layout="inline" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col span={8}>
              <Form.Item name="name" label="姓名">
                <Input placeholder="请输入姓名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="age" label="年龄">
                <Input placeholder="请输入年龄" type="number" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <Button type="primary" onClick={addPerInfo}>
            新增
          </Button>
        </div>

        {tableComponent}

        {isModalOpen && (
          <ModalComponent
            isModalOpen={isModalOpen}
            isEdit={isEdit}
            editData={editData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </Card>
    </>
  );
};

export default PerInfo;
