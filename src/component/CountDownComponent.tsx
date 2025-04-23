import React, { useState, useEffect } from 'react';

const CountDownComponent: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  const updateCountdown = () => {
    // 今晚12点的时间
    const targetDate = new Date();
    targetDate.setHours(24, 0, 0, 0);
    const now = new Date();
    const timeDifference = targetDate.getTime() - now.getTime();
    if (timeDifference <= 0) {
      return setTimeLeft('时间已到');
    }
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    setTimeLeft(`${hours}小时 ${minutes}分钟 ${seconds}秒`);
    requestAnimationFrame(updateCountdown);
  };

  useEffect(() => {
    updateCountdown(); // 初始化时调用一次
    // const interval = setInterval(updateCountdown, 1000); // 每秒更新倒计时
    // return () => clearInterval(interval); // 清理定时器
  }, []);

  return <div>{timeLeft}</div>;
};

export default CountDownComponent;
