import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import axios, { AxiosError } from 'axios';
import { Spin, Alert, Button, message } from 'antd'; // 引入 Ant Design 组件用于加载状态和错误提示
import ModalComponent from './component/Modal'; // 引入自定义的弹窗组件

// 定义用户信息类型
interface User {
  id: number;
  name: string;
  email: string;
}

// 定义文章信息类型
interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// 定义接口返回的数据类型
interface ApiResponseData {
  user: User;
  posts: Post[];
  postCount: number;
}

// 定义接口返回的完整类型
interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiResponseData;
}

const AuthorListPage: React.FC = () => {
  // 使用useParams获取路由参数
  const { authorId } = useParams<{ authorId: string }>();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [visible, setVisible] = useState(false);
  // 定义创建文章的接口调用函数
  const createPost = async (postData: any) => {
    try {
      const res = await axios.post<ApiResponse>(`http://localhost:3000/api/posts`, postData);
      console.log('文章创建成功', res.data);
      // 重新获取文章列表
      run();
      setVisible(false);
      // 可以在这里处理成功后的逻辑，比如显示成功提示
      messageApi.success('文章创建成功');
    } catch (err: unknown) {
      console.error('文章创建失败', err);
      // 可以在这里处理错误，比如显示错误提示
      if (axios.isAxiosError(err)) {
        messageApi.error(err.message || '文章创建失败');
      } else {
        messageApi.error('文章创建失败');
      }
    }
  };
  const handleOk = (obj) => {
    console.log('新增的文章数据', obj);
    createPost(obj);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  // 使用useRequest来获取作者文章
  // 显式指定 useRequest 的第二个类型参数为 Error
  const { data, error, loading, run } = useRequest<ApiResponse, any>(
    async () => {
      const res = await axios.get<ApiResponse>(`http://localhost:3000/api/users/${authorId}/posts`);
      return res.data;
    },
    {
      refreshDeps: [authorId],
      manual: true,
      // manual: true：表明请求不会在组件初始化时自动触发，需要手动调用 run 函数来触发请求。
      // refreshDeps: [authorId]：指定依赖项数组，当 authorId 发生变化时，useRequest 会重新执行请求函数。
      onSuccess: (res) => {
        console.log('onSuccess', res);
      },
    },
  );

  // 手动触发请求
  useEffect(() => {
    if (authorId) {
      run();
    }
  }, [authorId, run]);

  // 检查 authorId 是否存在，若不存在直接返回提示信息
  if (!authorId) {
    return (
      <Alert
        message="错误"
        description="作者 ID 不存在"
        type="error"
        showIcon
        style={{ margin: '20px 0' }}
      />
    );
  }

  // 处理加载状态
  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <Alert
        message="错误"
        description={error.message}
        type="error"
        showIcon
        style={{ margin: '20px 0' }}
      />
    );
  }

  // 处理空数据状态
  if (data && data.data.posts.length === 0) {
    return (
      <Alert
        message="暂无数据"
        description="该作者还没有发布任何文章"
        type="info"
        showIcon
        style={{ margin: '20px 0' }}
      />
    );
  }

  return (
    <div>
      <h2>作者 {authorId} 的文章列表</h2>
      <p>文章总数: {data ? data.data.postCount : 0}</p>
      <Button onClick={() => setVisible(true)}>写文章</Button>
      {data &&
        data.data.posts.map((post: Post, index: number) => (
          <div
            key={index}
            style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}
            onClick={() => {}}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}

      {/* 弹窗 */}
      <ModalComponent
        title={'新增文章'}
        visible={visible}
        onCancel={() => handleCancel()}
        onOk={handleOk}
      />
      {contextHolder}
    </div>
  );
};

export default AuthorListPage;
