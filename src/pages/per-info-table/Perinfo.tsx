import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { Button, Card, Input, message, Form, Row, Col, Space } from 'antd';
import { createStyles } from 'antd-style';
import TableComponent from './TableComponent';
import ModalComponent from './ModalComponent';
import { ApiConfigContext } from '../../App';
import {
  getPersons,
  deletePerson,
  updatePerson,
  addPerson,
  searchPersons,
} from '../../services/api';

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

// Make DataType compatible with Person
export interface DataType {
  key: React.Key;
  id: number;
  name: string;
  age: number;
  address: string;
  email: string;
  phone: string;
  [key: string]: string | number | boolean | undefined | React.Key;
}

// Update SearchFormValues to be compatible with Partial<Person>
export type FormItemType = {
  label: string;
  name: string;
  rules?: Record<string, unknown>[];
  element: React.ReactNode;
};

interface SearchFormValues {
  name?: string;
  age?: number;
  [key: string]: string | number | undefined;
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
    try {
      return (await getPersons()) as unknown as DataType[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      message.error(`请求失败: ${errorMessage}`);
      throw error;
    }
  }, []);

  useEffect(() => {
    const fetchAndLoadData = async () => {
      try {
        const data = await fetchData();
        setTimeout(() => {
          setDataSource(data);
          setLoading(false);
        }, 500);
      } catch {
        // 错误已在fetchData中处理
      }
    };

    fetchAndLoadData();
  }, [fetchData]);

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
          await deletePerson(id);
          console.log('删除成功');
          const newData = await fetchData();
          setDataSource(newData);
        } catch (error) {
          console.error('删除失败:', error);
        }
      }
    },
    [fetchData],
  );

  const handleSubmit = async (values: DataType) => {
    try {
      if (isEdit && editData) {
        // 转换为API需要的格式
        const apiData = {
          name: values.name,
          age: values.age,
          address: values.address,
          email: values.email,
          phone: values.phone,
        };
        await updatePerson(editData.id, apiData);
      } else {
        // 转换为API需要的格式
        const apiData = {
          name: values.name,
          age: values.age,
          address: values.address,
          email: values.email,
          phone: values.phone,
        };
        await addPerson(apiData);
      }

      console.log(`${isEdit ? '修改' : '新增'}成功`);
      message.success(`${isEdit ? '修改' : '新增'}成功`);

      const newData = await fetchData();
      setDataSource(newData);
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      message.error(`操作失败: ${errorMessage}`);
      console.error('错误信息:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async (values: SearchFormValues) => {
    setLoading(true);
    try {
      // 转换为API需要的格式
      const apiParams = {
        name: values.name,
        age: values.age,
      };
      const data = await searchPersons(apiParams);
      setDataSource(data as unknown as DataType[]);
      message.success('查询成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      message.error(`查询失败: ${errorMessage}`);
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

  const renderHexaer = () => (
    <>
      <h1>hahahah1</h1>
    </>
  );
  return (
    <>
      {renderHexaer()}
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
