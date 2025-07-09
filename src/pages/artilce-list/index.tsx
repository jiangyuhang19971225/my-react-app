import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { Descriptions, Card, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Author {
  email: string;
  name: string;
}

interface Article {
  id: number;
  status: string;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  userId: number;
  updateAt: string;
  author: Author;
}

const ArticleList: React.FC = () => {
  const [article, setArticle] = useState<Article[]>([]);
  const fetchUserData = async () => {
    // 这里如果使用fetch怎么处理
    // const res = await fetch('http://localhost:3000/api/posts');
    // if (!res.ok) {
    //   throw new Error('Network response was not ok');
    // }
    // const data = await res.json();
    // console.log('data', data);
    const res = await axios('http://localhost:3000/api/posts');
    console.log('res', res);
    if (get(res, 'status') !== 200) {
      throw new Error('Network response was not ok');
    }
    const data = get(res, 'data.data', []);
    setArticle(data);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const navigate = useNavigate();
  const jumpAuthor = (authorId: number) => {
    navigate(`/author/${authorId}`);
    // navigate(`/author?authorId=${authorId}`);
    // const [searchParams] = useSearchParams();
    // const authorId = searchParams.get('authorId');
    // 这里可以使用 navigate 来跳转到作者详情页
    // 例如 navigate(`/author/${authorId}`);
    // 也可以使用 window.location.href 来跳转
    // window.location.href = `/author/${authorId}`;
  };
  return (
    <div>
      <h1>文章列表</h1>
      <ul>
        {article.map((item) => {
          return (
            <Card key={item.id} style={{ marginBottom: 16 }}>
              <Descriptions title={item.title}>
                <Descriptions.Item label="内容">
                  <Tooltip title={item.content}>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3, // 设置展示 3 行，可按需调整
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.content}
                    </div>
                  </Tooltip>
                </Descriptions.Item>
                <Descriptions.Item label="作者" span={1}>
                  <span onClick={() => jumpAuthor(item.userId)} style={{ cursor: 'pointer' }}>
                    {item.author.name} ({item.author.email})
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间" span={3}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          );
        })}
      </ul>
    </div>
  );
};

export default ArticleList;
