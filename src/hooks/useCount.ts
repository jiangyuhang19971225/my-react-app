import { useState, useEffect } from 'react';

export const useCount = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue);
  const increment = () => {
    setCount((prev) => {
      return prev + 1;
    });
  };

  useEffect(() => {
    console.log('useCount effect');
    const timer = setInterval(() => {
      increment();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return { count, increment };
};
