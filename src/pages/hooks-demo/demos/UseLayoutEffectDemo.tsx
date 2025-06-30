import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from '../index.module.css';

export const UseLayoutEffectDemo: React.FC = () => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const divRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('短文本');

  // useLayoutEffect - 同步执行，DOM更新后立即执行
  useLayoutEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(rect.height);
      setWidth(rect.width);
      console.log('useLayoutEffect: DOM测量完成', { height: rect.height, width: rect.width });
    }
  });

  // useEffect - 异步执行，用于对比
  useEffect(() => {
    console.log('useEffect: 在useLayoutEffect之后执行');
  });

  const toggleContent = () => {
    setContent((prev) =>
      prev === '短文本'
        ? '这是一个非常长的文本内容，用来演示当内容变化时，useLayoutEffect 如何同步测量DOM尺寸，避免页面闪烁问题。useLayoutEffect 会在浏览器绘制之前同步执行，确保测量的准确性。'
        : '短文本',
    );

    // 触发动画效果
    setAnimationClass(styles.measuring);
    setTimeout(() => setAnimationClass(''), 300);
  };

  return (
    <section className={styles.section}>
      <h2>8. useLayoutEffect - 同步副作用</h2>
      <div className={styles.layoutDemo}>
        <h4>DOM 测量演示:</h4>
        <div ref={divRef} className={`${styles.measuredBox} ${animationClass}`}>
          {content}
        </div>

        <div className={styles.measurements}>
          <p>
            高度: <strong>{height.toFixed(1)}px</strong>
          </p>
          <p>
            宽度: <strong>{width.toFixed(1)}px</strong>
          </p>
        </div>

        <button onClick={toggleContent} className={styles.button}>
          切换内容长度
        </button>

        <p className={styles.tip}>💡 打开控制台查看 useLayoutEffect 和 useEffect 的执行顺序</p>
      </div>
    </section>
  );
};
