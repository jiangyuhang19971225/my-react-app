import React, { useEffect } from 'react';
import styles from './index.module.css';
import { Spin } from 'antd';
import useSWR from 'swr';
import { getUsers, User } from '../../services/api';

const ImgList: React.FC = () => {
  const fetcher = async (): Promise<User[]> => {
    const response = await getUsers();
    return response as unknown as User[];
  };

  const { data, error, isLoading, mutate } = useSWR<User[]>('users', fetcher);

  // 错误的定时器位置（直接放在函数体内）
  useEffect(() => {
    // 正确的做法是用useEffect包裹并设置清理函数
    const timer = setTimeout(() => {
      mutate();
    }, 5000);

    return () => clearTimeout(timer); // 清理定时器
  }, [mutate]); // 添加mutate依赖

  const renderList = () => {
    if (isLoading) {
      return <Spin>loading...</Spin>;
    }

    if (error) {
      return (
        <div>
          请求失败
          {JSON.stringify(error)}
        </div>
      );
    }

    return (
      data &&
      data.map((item: User) => {
        return (
          <div key={item.id} className={styles.cardContainer}>
            <img src={`https://robohash.org/${item.id}`} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.email}</p>
          </div>
        );
      })
    );
  };

  return (
    <>
      <div className={styles.app}>
        <div className={styles.header}>
          <h1>罗伯特机器人炫酷吊炸天online购物平台的名字要长</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {renderList()}
        </div>
      </div>
    </>
  );
};

export default ImgList;
