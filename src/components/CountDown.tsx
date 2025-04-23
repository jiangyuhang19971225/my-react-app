import React, { useState, useEffect } from 'react';

const CountDown: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(10);

  useEffect(() => {
    // 获取系统当前时间并计算
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // 清除定时器
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <p>{countdown > 0 ? `倒计时：${countdown}秒` : '倒计时结束！'}</p>
    </div>
  );
};

export default CountDown;
