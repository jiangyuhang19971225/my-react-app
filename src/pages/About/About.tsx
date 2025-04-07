import React, { useEffect } from 'react';
import { Card } from 'antd';
import { useCount } from '../../hooks/useCount.ts';
import useRequest from '../../hooks/useRequest.ts';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import styles from './index.module.css';

const About: React.FC = () => {
  const fn = async () => {
    const responses = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await responses.json();
    return data;
  };
  const { data, error, loading, request } = useRequest(fn);
  console.log('jyhdata', data);

  const { count } = useCount(0);

  useEffect(() => {
    request();
  }, []);

  return (
    <>
      <Card title="About Page" className={styles.card}>
        <div>hooks useCount 数字自增 </div>
        <div>count: {count}</div>
      </Card>

      <Card title="request" className={styles.card}>
        {data &&
          data.length > 0 &&
          data.map((ele) => {
            return <div key={ele.id}> {ele.address.street}</div>;
          })}
        {error} {loading}
      </Card>
      <Card className={styles.card} title="JSON数据展示">
        <JsonView src={data} theme="vscode" displayArrayIndex={false}></JsonView>
      </Card>
    </>
  );
};

export default About;
