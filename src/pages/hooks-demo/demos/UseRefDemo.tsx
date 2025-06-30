import React, { useRef, useState } from 'react';
import styles from '../index.module.css';

const Timer = () => {
  const timeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [count, setCount] = useState(0);

  const start = () => {
    timeRef.current = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
  };

  const stop = () => {
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  };

  return (
    <div>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
      <p>计数: {count}</p>
    </div>
  );
};

export const UseRefDemo: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const countRef = useRef(0);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const incrementCount = () => {
    countRef.current += 1;
    console.log('Current count (不会触发重渲染):', countRef.current);
  };

  return (
    <section className={styles.section}>
      <h2>2. useRef - DOM 操作和持久化值</h2>
      <div className={styles.subSection}>
        <h3>DOM 引用示例:</h3>
        <input ref={inputRef} placeholder="点击按钮聚焦到这里" className={styles.input} />
        <button onClick={focusInput} className={styles.button}>
          聚焦输入框
        </button>
      </div>

      <div className={styles.subSection}>
        <h3>持久化值示例 (不触发重渲染):</h3>
        <p>计数器值: {countRef.current} (查看控制台)</p>
        <button onClick={incrementCount} className={styles.button}>
          增加计数 (不重渲染)
        </button>
      </div>
      <div>
        修改不触发重渲染
        <Timer />
      </div>
    </section>
  );
};
