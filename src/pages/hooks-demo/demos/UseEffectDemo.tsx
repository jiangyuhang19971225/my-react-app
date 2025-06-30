import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import styles from '../index.module.css';

export const UseEffectDemo: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // 模拟API调用
  const fetchUsers = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟API响应
      const mockUsers: User[] = Array.from({ length: 5 }, (_, i) => ({
        id: (pageNum - 1) * 5 + i + 1,
        name: `用户 ${(pageNum - 1) * 5 + i + 1}`,
        email: `user${(pageNum - 1) * 5 + i + 1}@example.com`,
        company: { name: `公司 ${Math.floor(Math.random() * 10) + 1}` },
      }));

      setUsers((prev) => (pageNum === 1 ? mockUsers : [...prev, ...mockUsers]));
    } catch {
      setError('获取数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect 示例：组件挂载时获取数据
  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  // useEffect 示例：清理函数
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('定时器执行 - 每5秒输出一次');
    }, 5000);

    return () => {
      console.log('清理定时器');
      clearInterval(timer);
    };
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  return (
    <section className={styles.section}>
      <h2>7. useEffect - 副作用处理</h2>
      <div className={styles.dataFetching}>
        <h4>用户列表:</h4>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.userList}>
          {users.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <h5>{user.name}</h5>
              <p>{user.email}</p>
              <small>{user.company.name}</small>
            </div>
          ))}
        </div>

        <button onClick={loadMore} disabled={loading} className={styles.button}>
          {loading ? '加载中...' : '加载更多'}
        </button>
      </div>
    </section>
  );
};
