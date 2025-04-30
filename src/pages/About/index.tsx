import React, { useEffect, useCallback, memo, useMemo } from 'react';
import { Card } from 'antd';
import { useCount } from '../../hooks/useCount.ts';
import useRequest from '../../hooks/useRequest.ts';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import styles from './index.module.css';
import { getUsers, User } from '../../services/api.ts';
import CountDownComponent from '../../components/CountDownComponent.tsx';
import Robot from '../../components/Robot.tsx';

// 将计数器功能抽离为单独组件
const CounterDisplay = memo(() => {
  const { count } = useCount(0);

  return (
    <div>
      <div>hooks useCount 数字自增 </div>
      <div>count: {count}</div>
    </div>
  );
});

const About: React.FC = () => {
  const fn = useCallback(async () => {
    const response = await getUsers();
    return response as unknown as User[];
  }, []);

  const { data, error, loading, request } = useRequest<User[]>(fn);
  console.log('jyhcs', data);

  useEffect(() => {
    request();
  }, []);

  const fn1 = useMemo(() => {
    return <CountDownComponent />;
  }, []);

  return (
    <>
      {/* <iframe
        src="http://127.0.0.1:5500/model-viewer.html"
        style={{ width: '100%', height: '500px', border: 'none' }}
      ></iframe> */}
      <Card title="About Page" className={styles.card}>
        <CounterDisplay />
        <div>
          <span>倒计时 组件使用系统时间校准</span>
          {fn1}
          <CountDownComponent />
        </div>

        <h1>
          <Robot></Robot>
        </h1>
      </Card>

      <Card title="request" className={styles.card}>
        {data &&
          data.length > 0 &&
          data.map((ele) => {
            return <div key={ele.id}> {ele.address?.street}</div>;
          })}
        {error ? <div>{String(error)}</div> : null}
        {loading && <div>Loading...</div>}
        {/* {error && <div>{String(error)}</div>} {loading && <div>Loading...</div>} */}
      </Card>
      <Card className={styles.card} title="JSON数据展示">
        {data && <JsonView src={data} theme="vscode" displayArrayIndex={false} />}
      </Card>
    </>
  );
};

export default memo(About);
