import React, { useEffect } from 'react';
import styles from './index.module.css';
import { Spin } from 'antd';
import useSWR from 'swr';

interface IImgListProps {
  id: string;
  name: string;
  email: string;
  [key: string]: string;
}

const ImgList: React.FC = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      method: 'get',
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('请求失败');
    return res.json();
  };
  const { data, error, isLoading, mutate } = useSWR<IImgListProps[]>(
    'https://jsonplaceholder.typicode.com/users',
    fetcher,
    {
      // revalidateOnFocus: false, // 关闭窗口聚焦重新请求
      // refreshInterval: 300000, // 5分钟自动刷新
    },
  );
  // const [listData, setListData] = React.useState([]);
  // const [loading, setLoading] = React.useState(true);
  // const fetchData = async () => {
  //   const responses = await fetch('https://jsonplaceholder.typicode.com/users');
  //   const data = await responses.json();
  //   setListData(data);
  //   setLoading(false);
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);

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
      data.map((item: IImgListProps) => {
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
